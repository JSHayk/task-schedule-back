import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsNumber()
    @IsNotEmpty()
    statusId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
