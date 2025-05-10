import { Controller, Post, Get, Param, UseGuards, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser, User } from '../auth/get-user.decorator';
export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Post(':enrollmentId')
  @UseGuards(JwtAuthGuard)
  async issueCertificate(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @GetUser() user: User,
  ) {
    if (user.role !== Role.STUDENT) {
      throw new ForbiddenException('Only students can request certificates');
    }
    return this.certificatesService.issueCertificate(enrollmentId, user.userId);
  }

  @Post(':enrollmentId/generate')
  @UseGuards(JwtAuthGuard)
  async generateCertificate(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @GetUser() user: User,
  ) {
    if (user.role !== Role.STUDENT) {
      throw new ForbiddenException('Only students can generate certificates');
    }
    return this.certificatesService.generateCertificate(enrollmentId, user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCertificate(
    @Param('id', ParseIntPipe) certificateId: number,
    @GetUser() user: User,
  ) {
    return this.certificatesService.getCertificate(certificateId, user.userId);
  }

  @Get('config/debug')
  async debugConfig() {
    return { baseUrl: process.env.BASE_URL };
  }
}