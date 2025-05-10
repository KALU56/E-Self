import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Query, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreateNewCourseDto } from './dto/create-course.dto';
import { SearchCoursesDto } from './dto/search-course.dto';
import { CourseService } from './course.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Controller('courses')
export class CourseController {
  constructor(
    private courseService: CourseService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCourse(
    @Body() createCourseDto: CreateNewCourseDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can create courses');
    }
    const course = await this.courseService.createCourse(createCourseDto, user.userId);
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (course.imageUrl) {
      course.imageUrl = `${baseUrl}${course.imageUrl.startsWith('/') ? '' : '/'}${course.imageUrl}`;
    }
    return course;
  }

  @Get()
  async getCourses() {
    return this.courseService.getCourses();
  }

  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseById(id);
  }

  @Get('search')
  async searchCourses(@Query() searchParams: SearchCoursesDto) {
    return this.courseService.searchCourses(searchParams);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: CreateNewCourseDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can update courses');
    }
    return this.courseService.updateCourse(id, updateCourseDto, user.userId);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  async togglePublishCourse(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can publish courses');
    }
    return this.courseService.togglePublishCourse(id, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCourse(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can delete courses');
    }
    return this.courseService.deleteCourse(id, user.userId);
  }

  @Get('instructor/:instructorId')
  @UseGuards(JwtAuthGuard)
  async getInstructorCourses(
    @Param('instructorId', ParseIntPipe) instructorId: number,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.userId !== instructorId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You can only view your own courses');
    }
    return this.courseService.getInstructorCourses(instructorId);
  }

  @Post(':id/discounts')
  @UseGuards(JwtAuthGuard)
  async createDiscount(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() createDiscountDto: CreateDiscountDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can create discounts');
    }
    return this.courseService.createDiscount(courseId, createDiscountDto);
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can submit reviews');
    }
    return this.courseService.createReview(courseId, user.userId, createReviewDto);
  }

  @Post(':id/content/:contentId/submissions')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() submitQuizDto: SubmitQuizDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can submit quizzes');
    }
    return this.courseService.submitQuiz(courseId, contentId, user.userId, submitQuizDto);
  }

  @Patch(':id/content/:contentId/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() updateProgressDto: UpdateProgressDto,
    @GetUser() user: { userId: number; email: string; role: string },
  ) {
    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can update progress');
    }
    return this.courseService.updateProgress(courseId, contentId, user.userId, updateProgressDto);
  }
}