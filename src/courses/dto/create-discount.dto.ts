import { IsString, IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  code: string;

  @IsIn(['PERCENTAGE', 'FIXED'])
  type: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  value: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}