import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateNewCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsString()
  category: string;

  @IsString()
  language: string;

  @IsString()
  @IsOptional()
  level?: string;
}

