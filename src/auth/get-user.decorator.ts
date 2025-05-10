import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface User {
  userId: number;
  email: string;
  role: string;
}

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest();
    const user: User | undefined = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user[data] : user;
  },
);