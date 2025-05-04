import {
    Controller,
    Post,
    Body,
    Query,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  import { JwtAuthGuard } from './jwt-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
  
    @Post('login')
    login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }
  
    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
      return this.authService.verifyEmail(token);
    }
  
    @Post('refresh-token')
    refresh(@Body('refreshToken') token: string) {
      return this.authService.refreshToken(token);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Req() req) {
      return this.authService.logout(req.user.userId);
    }
  }
  