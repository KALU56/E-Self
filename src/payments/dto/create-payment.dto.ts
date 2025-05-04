import { IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  courseId: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}