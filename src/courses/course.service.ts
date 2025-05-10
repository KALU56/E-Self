import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewCourseDto } from './dto/create-course.dto';
import { SearchCoursesDto } from './dto/search-course.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Course, DiscountType, Role } from '@prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);
  private instructorCache = new Map<number, boolean>();

  constructor(private prisma: PrismaService) {}

  private async validateInstructor(userId: number): Promise<void> {
    if (!Number.isInteger(userId) || userId <= 0) {
      this.logger.warn(`Invalid userId: ${userId}`);
      throw new ForbiddenException('Invalid user ID');
    }

    if (this.instructorCache.has(userId)) {
      if (!this.instructorCache.get(userId)) {
        throw new ForbiddenException('Only instructors can manage courses');
      }
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.INSTRUCTOR) {
      this.instructorCache.set(userId, false);
      throw new ForbiddenException('Only instructors can manage courses');
    }

    this.instructorCache.set(userId, true);
  }

  async createCourse(dto: CreateNewCourseDto, userId: number): Promise<Course> {
    this.logger.debug(`Creating course: ${dto.title}, userId: ${userId}`);
    await this.validateInstructor(userId);

    if (dto.price <= 0) {
      throw new ForbiddenException('Price must be a positive number');
    }
    if (dto.duration <= 0) {
      throw new ForbiddenException('Duration must be a positive number');
    }

    try {
      const course = await this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? '',
          price: dto.price,
          duration: dto.duration,
          category: dto.category ?? 'Uncategorized',
          language: dto.language ?? 'English',
          level: dto.level ?? 'Beginner',
          instructorId: userId,
          isPublished: false,
        },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      this.logger.debug(`Course created: ${course.id}`);
      return course;
    } catch (error) {
      this.logger.error(`Failed to create course: ${error.message}`);
      throw error;
    }
  }

  async getCourses(includeUnpublished = false) {
    this.logger.debug(`Fetching courses, includeUnpublished: ${includeUnpublished}`);
    try {
      return await this.prisma.course.findMany({
        where: includeUnpublished ? {} : { isPublished: true },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { enrollments: true, reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch courses: ${error.message}`);
      throw error;
    }
  }

  async getCourseById(id: number) {
    this.logger.debug(`Fetching course: ${id}`);
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          contents: {
            orderBy: { order: 'asc' },
          },
          reviews: {
            include: {
              student: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      this.logger.error(`Failed to fetch course ${id}: ${error.message}`);
      throw error;
    }
  }

  async updateCourse(id: number, dto: CreateNewCourseDto, userId: number): Promise<Course> {
    this.logger.debug(`Updating course: ${id}, userId: ${userId}`);
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are not authorized to update this course');
    }

    if (dto.price !== undefined && dto.price <= 0) {
      throw new ForbiddenException('Price must be a positive number');
    }
    if (dto.duration !== undefined && dto.duration <= 0) {
      throw new ForbiddenException('Duration must be a positive number');
    }

    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          title: dto.title ?? course.title,
          description: dto.description ?? course.description,
          price: dto.price ?? course.price,
          duration: dto.duration ?? course.duration,
          category: dto.category ?? course.category,
          language: dto.language ?? course.language,
          level: dto.level ?? course.level,
          updatedAt: new Date(),
        },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update course ${id}: ${error.message}`);
      throw error;
    }
  }

  async togglePublishCourse(id: number, userId: number): Promise<Course> {
    this.logger.debug(`Toggling publish for course: ${id}, userId: ${userId}`);
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only publish your own courses');
    }

    if (!course.isPublished) {
      const contentCount = await this.prisma.content.count({
        where: { courseId: id },
      });
      if (contentCount === 0) {
        throw new ForbiddenException('Course must have at least one content before publishing');
      }
    }

    try {
      return await this.prisma.course.update({
        where: { id },
        data: {
          isPublished: !course.isPublished,
          updatedAt: new Date(),
        },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to toggle publish for course ${id}: ${error.message}`);
      throw error;
    }
  }

  async deleteCourse(id: number, userId: number): Promise<Course> {
    this.logger.debug(`Deleting course: ${id}, userId: ${userId}`);
    await this.validateInstructor(userId);

    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this course');
    }

    try {
      return await this.prisma.course.delete({
        where: { id },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to delete course ${id}: ${error.message}`);
      throw error;
    }
  }

  async getInstructorCourses(userId: number) {
    this.logger.debug(`Fetching instructor courses for userId: ${userId}`);
    await this.validateInstructor(userId);

    try {
      return await this.prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { enrollments: true, reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch instructor courses for userId ${userId}: ${error.message}`);
      throw error;
    }
  }

  async searchCourses(filters: SearchCoursesDto) {
    this.logger.debug(`Searching courses with filters: ${JSON.stringify(filters)}`);
    const {
      query,
      category,
      language,
      level,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      isPublished,
    } = filters;

    try {
      return await this.prisma.course.findMany({
        where: {
          AND: [
            query
              ? {
                  OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                  ],
                }
              : {},
            category ? { category } : {},
            language ? { language } : {},
            level ? { level } : {},
            minPrice !== undefined ? { price: { gte: minPrice } } : {},
            maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
            minDuration !== undefined ? { duration: { gte: minDuration } } : {},
            maxDuration !== undefined ? { duration: { lte: maxDuration } } : {},
            isPublished !== undefined ? { isPublished } : {},
          ],
        },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { enrollments: true, reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to search courses: ${error.message}`);
      throw error;
    }
  }

  async createDiscount(courseId: number, dto: CreateDiscountDto) {
    this.logger.debug(`Creating discount for course: ${courseId}`);
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (dto.value <= 0) {
      throw new ForbiddenException('Discount value must be positive');
    }
    if (dto.startDate >= dto.endDate) {
      throw new ForbiddenException('End date must be after start date');
    }
    if (!Object.values(DiscountType).includes(dto.type as DiscountType)) {
      throw new ForbiddenException(`Invalid discount type: ${dto.type}`);
    }

    try {
      return await this.prisma.discount.create({
        data: {
          courseId,
          code: dto.code,
          type: dto.type as DiscountType,
          value: dto.value,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create discount for course ${courseId}: ${error.message}`);
      throw error;
    }
  }

  async createReview(courseId: number, studentId: number, dto: CreateReviewDto) {
    this.logger.debug(`Creating review for course: ${courseId}, studentId: ${studentId}`);
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student not enrolled in this course');
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new ForbiddenException('Rating must be between 1 and 5');
    }

    try {
      return await this.prisma.review.upsert({
        where: { studentId_courseId: { studentId, courseId } },
        update: { rating: dto.rating, comment: dto.comment ?? '' },
        create: {
          studentId,
          courseId,
          rating: dto.rating,
          comment: dto.comment ?? '',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create review for course ${courseId}: ${error.message}`);
      throw error;
    }
  }

  async submitQuiz(courseId: number, contentId: number, userId: number, dto: SubmitQuizDto) {
    this.logger.debug(`Submitting quiz for content: ${contentId}, userId: ${userId}`);
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: { course: true },
    });
    if (!content || content.courseId !== courseId || content.type !== 'QUIZ') {
      throw new NotFoundException('Quiz not found or invalid');
    }
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student not enrolled in this course');
    }

    if (dto.score < 0 || dto.score > 100) {
      throw new ForbiddenException('Score must be between 0 and 100');
    }
    if (!Array.isArray(dto.answers)) {
      throw new ForbiddenException('Answers must be an array');
    }

    try {
      return await this.prisma.quizSubmission.upsert({
        where: { userId_contentId: { userId, contentId } },
        update: {
          answers: dto.answers,
          score: dto.score,
          submittedAt: new Date(),
        },
        create: {
          userId,
          contentId,
          answers: dto.answers,
          score: dto.score,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to submit quiz for content ${contentId}: ${error.message}`);
      throw error;
    }
  }

  async updateProgress(courseId: number, contentId: number, userId: number, dto: UpdateProgressDto) {
    this.logger.debug(`Updating progress for content: ${contentId}, userId: ${userId}`);
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: { course: true },
    });
    if (!content || content.courseId !== courseId) {
      throw new NotFoundException('Content not found');
    }
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student not enrolled in this course');
    }

    try {
      const progress = await this.prisma.userProgress.upsert({
        where: { userId_contentId: { userId, contentId } },
        update: {
          isCompleted: dto.isCompleted,
          completedAt: dto.isCompleted ? new Date() : null,
        },
        create: {
          userId,
          contentId,
          isCompleted: dto.isCompleted,
          completedAt: dto.isCompleted ? new Date() : null,
        },
      });

      const totalContent = await this.prisma.content.count({ where: { courseId } });
      const completedContent = await this.prisma.userProgress.count({
        where: { userId, content: { courseId }, isCompleted: true },
      });
      const progressPercentage = totalContent > 0 ? Number(((completedContent / totalContent) * 100).toFixed(2)) : 0;

      await this.prisma.enrollment.update({
        where: { studentId_courseId: { studentId: userId, courseId } },
        data: { progress: progressPercentage },
      });

      return progress;
    } catch (error) {
      this.logger.error(`Failed to update progress for content ${contentId}: ${error.message}`);
      throw error;
    }
  }
}