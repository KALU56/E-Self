import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async issueCertificate(enrollmentId: number, studentId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true, student: true },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    if (enrollment.studentId !== studentId || enrollment.student.role !== Role.STUDENT) {
      throw new ForbiddenException('Only the enrolled student can request a certificate');
    }
    if (enrollment.progress < 100) {
      throw new ForbiddenException('Course not completed');
    }

    const existingCertificate = await this.prisma.certificate.findUnique({
      where: { studentId_courseId: { studentId, courseId: enrollment.courseId } },
    });
    if (existingCertificate) {
      throw new ForbiddenException('Certificate already issued');
    }

    const certificateUrl = `${process.env.BASE_URL}/certificates/${enrollmentId}-${studentId}.pdf`;
    return this.prisma.certificate.create({
      data: {
        studentId,
        courseId: enrollment.courseId,
        enrollmentId,
        certificateUrl,
        issuedAt: new Date(),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });
  }

  async getCertificate(certificateId: number, userId: number) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== Role.ADMIN && certificate.studentId !== userId)) {
      throw new ForbiddenException('You are not authorized to view this certificate');
    }

    return certificate;
  }

  async generateCertificate(enrollmentId: number, studentId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true, student: true },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    if (enrollment.studentId !== studentId || enrollment.student.role !== Role.STUDENT) {
      throw new ForbiddenException('Only the enrolled student can generate a certificate');
    }
    if (enrollment.progress < 100) {
      throw new ForbiddenException('Course not completed');
    }

    const fileName = `${enrollmentId}-${studentId}.pdf`;
    const certificateUrl = `${process.env.BASE_URL}/certificate/download/${fileName}`;

    return this.prisma.certificate.upsert({
      where: { studentId_courseId: { studentId, courseId: enrollment.courseId } },
      update: {
        certificateUrl,
        issuedAt: new Date(),
      },
      create: {
        studentId,
        courseId: enrollment.courseId,
        enrollmentId,
        certificateUrl,
        issuedAt: new Date(),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });
  }
}