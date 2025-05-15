
import { Injectable, BadRequestException, UnauthorizedException, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12; // Increased from 10 for stronger hashing
  private readonly maxLoginAttempts = 5; // Limit login attempts
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string; verificationToken?: string }> {
    this.logger.debug(`Registering user: ${dto.email}`);
    try {
      const { email, password, name, phone, role, language } = dto;

      // Check for existing user
      const existingUser = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] },
      });
      if (existingUser) {
        this.logger.warn(`Email or phone already exists: ${email}, ${phone}`);
        throw new ConflictException('Email or phone already exists');
      }

      // Validate role
      if (role && !Object.values(Role).includes(role)) {
        this.logger.warn(`Invalid role: ${role}`);
        throw new ConflictException(`Invalid role: ${role}`);
      }

      // Enforce stronger password requirements (e.g., min 8 chars, mixed case, numbers, symbols)
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        this.logger.warn(`Weak password for: ${email}`);
        throw new BadRequestException(
          'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters'
        );
      }

      // Hash password with stronger salt rounds
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      const verificationToken = require('crypto').randomBytes(32).toString('hex');

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: role as Role || Role.STUDENT,
          verificationToken,
          isVerified: false,
          lockoutUntil: null, // Initialize lockout
        },
      });

      // Send verification email
      const emailResult = await this.emailService.sendVerificationEmail(email, verificationToken, language || 'en');
      if (!emailResult.success) {
        this.logger.warn(`Failed to send verification email to ${email}: ${emailResult.message}`);
        return {
          message: 'User registered successfully. Email sending failed - use this token to verify manually.',
          verificationToken,
        };
      }

      this.logger.debug(`User registered: ${user.id}`);
      return { message: 'User registered successfully. Please verify your email.' };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    this.logger.debug(`Verifying email with token: ${token}`);
    try {
      const user = await this.prisma.user.findFirst({
        where: { verificationToken: token },
      });
      if (!user) {
        this.logger.warn(`Invalid verification token: ${token}`);
        throw new BadRequestException('Invalid or expired verification token');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationToken: null },
      });

      this.logger.debug(`Email verified for user: ${user.id}`);
      return { message: 'Email verified successfully' };
    } catch (error) {
      this.logger.error(`Email verification failed: ${error.message}`, error.stack);
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug(`Logging in user: ${dto.emailOrPhone}`);
    try {
      // Find user by email or phone
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
        },
      });

      // Check if user exists
      if (!user) {
        this.logger.warn(`User not found: ${dto.emailOrPhone}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check for account lockout
      if (user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
        this.logger.warn(`Account locked for: ${dto.emailOrPhone}`);
        throw new UnauthorizedException('Account is temporarily locked due to too many failed login attempts');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        // Increment login attempts
        const updatedAttempts = user.loginAttempts + 1;
        const lockoutUntil = updatedAttempts >= this.maxLoginAttempts ? new Date(Date.now() + this.lockoutDuration) : null;

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: updatedAttempts,
            lockoutUntil,
          },
        });

        this.logger.warn(`Invalid password for: ${dto.emailOrPhone}, attempt ${updatedAttempts}`);
        throw new UnauthorizedException(
          updatedAttempts >= this.maxLoginAttempts
            ? 'Account locked due to too many failed attempts. Try again later.'
            : 'Invalid credentials'
        );
      }

      // Check if email is verified
      if (!user.isVerified) {
        this.logger.warn(`Unverified user attempted login: ${dto.emailOrPhone}`);
        throw new UnauthorizedException('Please verify your email first');
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0 || user.lockoutUntil) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockoutUntil: null },
        });
      }

      // Generate tokens
      const secret = this.configService.get<string>('JWT_SECRET');
      const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
      if (!secret || !refreshSecret) {
        this.logger.error('JWT_SECRET or REFRESH_TOKEN_SECRET is not defined');
        throw new InternalServerErrorException('Server configuration error');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload, { secret, expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { secret: refreshSecret, expiresIn: '7d' });

      // Store refresh token
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      this.logger.debug(`User logged in: ${user.id}, payload: ${JSON.stringify(payload)}`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug(`Refreshing token`);
    try {
      const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
      if (!refreshSecret) {
        this.logger.error('REFRESH_TOKEN_SECRET is not defined');
        throw new InternalServerErrorException('Server configuration error');
      }

      let payload;
      try {
        payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
        this.logger.debug(`Refresh token payload: ${JSON.stringify(payload)}`);
      } catch (error) {
        this.logger.warn(`Invalid refresh token: ${error.message}`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || user.refreshToken !== refreshToken) {
        this.logger.warn(`Refresh token mismatch or user not found: ${payload.sub}`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error('JWT_SECRET is not defined');
        throw new InternalServerErrorException('Server configuration error');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, { secret, expiresIn: '1h' });
      const newRefreshToken = this.jwtService.sign(newPayload, { secret: refreshSecret, expiresIn: '7d' });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      this.logger.debug(`Token refreshed for user: ${user.id}`);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logout(userId: number): Promise<{ message: string }> {
    this.logger.debug(`Logging out user: ${userId}`);
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      this.logger.debug(`User logged out: ${userId}`);
      return { message: 'User logged out successfully' };
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
