import { Injectable } from "@nestjs/common";
import { NotificationService } from "src/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProgressService {  

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async markContentAsCompleted(userId: number, contentId: number) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { courseId: true }
    });

    if (!content) {
      throw new Error('Content not found');
    }

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        contentId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    await this.checkCourseCompletion(userId, content.courseId);
    return progress;
  }

  async getUserProgress(userId: number, courseId: number) {
    return this.prisma.userProgress.findMany({
      where: {
        userId,
        content: {
          courseId,
        },
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true,  
          },
        },
      },
    });
  }

  async getCourseCompletionPercentage(userId: number, courseId: number) {
    const [completed, total] = await Promise.all([
      this.prisma.userProgress.count({
        where: {
          userId,
          isCompleted: true,
          content: { 
            courseId,
          },
        },
      }),
      this.prisma.content.count({
        where: {
          courseId,
        },
      }),
    ]);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  private async checkCourseCompletion(userId: number, courseId: number) {
    const percentage = await this.getCourseCompletionPercentage(userId, courseId);
    if (percentage === 100) {
      await this.notificationService.sendCourseCompletionNotification(userId, courseId);
      // await this.certificateService.generateCertificate(userId, courseId);
    }
  }
}