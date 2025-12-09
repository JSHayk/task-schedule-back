import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ReassignTaskDto } from '../dto/reassign-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
        return this.taskService.create(createTaskDto);
    }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('statusId') statusId?: string,
        @Query('userId') userId?: string
    ) {
        return this.taskService.findAll({
            search,
            statusId: statusId ? parseInt(statusId) : undefined,
            userId: userId ? parseInt(userId) : undefined
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taskService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(+id, updateTaskDto);
    }

    @Patch(':id/reassign')
    reassign(@Param('id') id: string, @Body(ValidationPipe) reassignDto: ReassignTaskDto) {
        return this.taskService.reassign(+id, reassignDto.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taskService.remove(+id);
    }
}
