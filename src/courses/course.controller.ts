import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {CoursesService} from './course.service';
import { CreateNewCourseDto } from './dto/create-course.dto';
import { SearchCoursesDto } from './dto/search-course.dto';
@Controller('courses')
export class CourseController {
    constructor(private courseService: CoursesService) { }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    crateCourse(@Body() dto:CreateNewCourseDto, @Request()req) {
        return this.courseService.createCourse(dto, req.user.sub);
    }

    @Get()
    getCourse() {
        return this.courseService.getCourses();
    }

    @Get('search')
    async searchCourses(@Query() searchParams: SearchCoursesDto){
        return this.courseService.searchCourses(searchParams);
    }
}