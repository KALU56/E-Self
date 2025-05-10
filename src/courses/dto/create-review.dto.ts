import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}