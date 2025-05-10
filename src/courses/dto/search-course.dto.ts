import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class SearchCoursesDto {

    @IsString()
    @IsOptional()
    query?: string;
    
    @IsString()
    @IsOptional()
    search?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    level?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    minPrice?: number;


    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    maxPrice?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    minDuration?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    maxDuration?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    isPublished?: boolean
}