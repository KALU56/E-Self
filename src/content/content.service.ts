import { PrismaService } from "src/prisma/prisma.service";
import { CreateContentDto } from "./dto/create-content.dto";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";


export class ContentService {
    constructor(private prisma: PrismaService) {}

    async createContent(courseId: number, dto: CreateContentDto, userId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        if (course.instructorId !== userId) {
            throw new Error('Only the instructor can add content');
        }

        return await this.prisma.content.create({
            data: {
                courseId,
                title: dto.title,
                type: dto.type as any,
                url: dto.url,
                content: dto.content,
                order: dto.order,

            },
        });
}

async getCourseContent(courseId: number, userId: number) {
    const course = await this.prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new NotFoundException('Course not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
        where: {
            courseId,
            studentId: userId,
        },
    });
    const isInstructor = course.instructorId === userId;

    if(!enrollment && !isInstructor) {
        throw new ForbiddenException('You must be enrolled in the course to view content');
    }

    return  this.prisma.content.findMany({
        where: { courseId },
        orderBy: { order: 'asc' },
    });
}

async submitQuiz(contentId: number, userId: number, dto:SubmitQuizDto) {
    const content = await this.prisma.content.findUnique({
        where: { id: contentId },
    });

    if (!content || content.type !== 'QUIZ') {
        throw new NotFoundException('Quiz not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
        where: {
            courseId: content.courseId,
            studentId: userId,
        },
    });

    if (!enrollment) {
        throw new ForbiddenException('You must be enrolled in the course to submit a quiz');
    }

    const quiz = JSON.parse(content.content || '[]')
    let score = 0;
    quiz.forEach((q: any, i: number)=>{
        if (q.correctAnswer === dto.answers[i].answer) {
            score += 100 / quiz.length; // Assuming each question is worth equal points
        }
    })
    return  this.prisma.quizSubmission.create({
        data: {
            contentId,
            userId,
            answers: JSON.stringify(dto.answers),
            score,
            submittedAt: new Date(),

        },
    });
}
async downloadContent(contentId: number, userId: number) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content || !content.url) {
      throw new NotFoundException('Content not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { courseId: content.courseId, studentId: userId },
    });
    const isInstructor = await this.prisma.course.findFirst({
      where: { id: content.courseId, instructorId: userId },
    });

    if (!enrollment && !isInstructor) {
      throw new ForbiddenException('You must be enrolled or the instructor to download content');
    }

    return { url: content.url };
  }

}