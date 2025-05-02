import { IsString, IsInt, IsOptional, IsIn } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsIn(['NOTE', 'VIDEO', 'QUIZ'])
  type: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  order: number;
}