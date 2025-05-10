import { IsBoolean } from 'class-validator';

export class UpdateProgressDto {
  @IsBoolean()
  isCompleted: boolean;
}