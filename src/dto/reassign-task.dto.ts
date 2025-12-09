import { IsNumber, IsNotEmpty } from 'class-validator';

export class ReassignTaskDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
