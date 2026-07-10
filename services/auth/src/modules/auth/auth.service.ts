import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { authActivityLogRepository } from '@agency-os/database';
import { JwtPayload, AuthResponse } from '@agency-os/types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_ACCESS_SECRET || 'default_access_secret';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
    return jwt.sign({ sub: payload.sub }, secret, { expiresIn: '7d' });
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // 1. Find user with roles and permissions
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Check brute force block (5+ failed logins in the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const failedAttempts = await authActivityLogRepository.getFailedLoginsSince(user.id, fifteenMinutesAgo);
    
    if (failedAttempts >= 5) {
      throw new HttpException(
        'Too many failed login attempts. Please try again after 15 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      // Log failed login event in MongoDB
      await authActivityLogRepository.logEvent({
        userId: user.id,
        organizationId: user.organizationId,
        event: 'failed_login',
        ipAddress,
        userAgent,
      });

      // Re-check failure count for immediate blocking response
      const updatedFailedAttempts = await authActivityLogRepository.getFailedLoginsSince(user.id, fifteenMinutesAgo);
      if (updatedFailedAttempts >= 5) {
        throw new HttpException(
          'Too many failed login attempts. Please try again after 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Construct JWT Payload
    const permissionsList = Array.from(
      new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.action),
        ),
      ),
    ) as string[];

    const rolesList = user.roles.map((ur) => ur.role.name);

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      roles: rolesList,
      permissions: permissionsList,
    };

    // 5. Generate Tokens
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    // Save refresh token to Postgres
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 6. Log successful login to MongoDB
    await authActivityLogRepository.logEvent({
      userId: user.id,
      organizationId: user.organizationId,
      event: 'login',
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        organizationId: user.organizationId,
        roles: rolesList,
        permissions: permissionsList,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  async logout(refreshTokenString: string): Promise<{ success: boolean }> {
    const dbToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshTokenString },
    });

    if (dbToken) {
      // Log logout event in MongoDB
      const user = await this.prisma.user.findUnique({ where: { id: dbToken.userId } });
      if (user) {
        await authActivityLogRepository.logEvent({
          userId: user.id,
          organizationId: user.organizationId,
          event: 'logout',
        });
      }

      // Delete refresh token
      await this.prisma.refreshToken.delete({
        where: { id: dbToken.id },
      });
    }

    return { success: true };
  }

  async refresh(dto: RefreshDto, ipAddress?: string, userAgent?: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify token exists in database
    const dbToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = dbToken.user;

    // 2. Generate new JWT Payload
    const permissionsList = Array.from(
      new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.action),
        ),
      ),
    ) as string[];

    const rolesList = user.roles.map((ur) => ur.role.name);

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId,
      roles: rolesList,
      permissions: permissionsList,
    };

    // 3. Rotate Tokens (delete old, create new)
    await this.prisma.refreshToken.delete({ where: { id: dbToken.id } });

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 4. Log refresh event to MongoDB
    await authActivityLogRepository.logEvent({
      userId: user.id,
      organizationId: user.organizationId,
      event: 'refresh',
      ipAddress,
      userAgent,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getUserActivity(userId: string): Promise<any[]> {
    return authActivityLogRepository.getRecentActivity(userId, 20);
  }
}
