import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService,
    private mailerService: MailerService
  ) {}

  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata,
      },
    });
  }

  async sendCourseCompletionNotification(userId: number, courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    return this.createNotification(
      userId,
      'COURSE_COMPLETION',
      'Course Completed!',
      `You've successfully completed ${course.title}`,
      { courseId }
    );
  }

  async getUserNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, 
    });
  }

  async sendCourseCompletionEmail(userId: number, courseId: number) {
    const [user, course] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!course) {
      throw new Error('Course not found');
    }

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Course Completed!: ${course.title}`,
      template: 'course-completion',
      context: {
        name: user.name,
        courseTitle: course.title,
        completionDate: new Date().toLocaleDateString(),
      },
    });
}

    
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: Number(notificationId) },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
