import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [PrismaModule, ConfigModule],
    controllers: [CourseController],
    providers: [CourseService, JwtService, PrismaService],
    
})
export class CoursesModule {}
