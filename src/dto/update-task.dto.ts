import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    statusId?: number;

    @IsNumber()
    @IsOptional()
    userId?: number;
}
