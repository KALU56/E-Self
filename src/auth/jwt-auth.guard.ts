import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('You are not authorized');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Token payload:', payload);
      request.user = payload;
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}