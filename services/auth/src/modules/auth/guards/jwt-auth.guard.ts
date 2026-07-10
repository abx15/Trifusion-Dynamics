import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();
    
    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      request.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
