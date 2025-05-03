import { PartialType } from '@nestjs/swagger';
import { CreateNewCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateNewCourseDto) {}