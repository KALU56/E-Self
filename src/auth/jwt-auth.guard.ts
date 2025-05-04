import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: any; // Add the user property to the Request interface
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
      const payload = await this.jwtService.verifyAsync(token); // ✅ use verifyAsync for async handling
      console.log('Token payload:', payload); // optional debug

      request.user = payload; // ✅ attach decoded payload to request.user
      return true;
    } catch (error) {
      console.error('JWT verification error:', error); // optional debug
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
