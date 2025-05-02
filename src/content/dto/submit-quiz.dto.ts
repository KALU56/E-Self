import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswer {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswer)
  answers: QuizAnswer[];
}