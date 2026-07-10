import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { type JwtPayload } from '@agency-os/types';
import { type Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getIpAndUserAgent(req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return { ip, userAgent };
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const { ip, userAgent } = this.getIpAndUserAgent(req);
    return this.authService.login(dto, ip, userAgent);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    const { ip, userAgent } = this.getIpAndUserAgent(req);
    return this.authService.refresh(dto, ip, userAgent);
  }

  @Get('me/activity')
  @UseGuards(JwtAuthGuard)
  getMeActivity(@CurrentUser() user: JwtPayload): Promise<any[]> {
    return this.authService.getUserActivity(user.sub);
  }
}
