import { IsNumber } from 'class-validator';

export class SubmitQuizDto {
  answers: any; // Adjust based on your quiz structure

  @IsNumber()
  score: number;
}