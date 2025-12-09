import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskCreatedEvent, TaskUpdatedEvent, TaskReassignedEvent } from '../events/task.events';
import { ERROR_MESSAGES, TASK_RELATIONS } from '../utils/constants';
import { parseDate, validateDateRange } from '../utils/date.utils';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private eventEmitter: EventEmitter2
    ) { }

    async checkOverlap(userId: number, startDate: Date, endDate: Date, excludeTaskId?: number): Promise<boolean> {
        const whereConditions: any = {
            userId,
        };

        if (excludeTaskId) {
            whereConditions.id = Not(excludeTaskId);
        }

        const overlappingTasks = await this.taskRepository.find({
            where: whereConditions,
        });

        return overlappingTasks.some(task =>
            task.startDate <= endDate && task.endDate >= startDate
        );
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const { userId, startDate, endDate, ...rest } = createTaskDto;

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        if (!validateDateRange(start, end)) {
            throw new BadRequestException(ERROR_MESSAGES.INVALID_DATE_RANGE);
        }

        const hasOverlap = await this.checkOverlap(userId, start, end);
        if (hasOverlap) {
            throw new BadRequestException(ERROR_MESSAGES.TASK_OVERLAP);
        }

        const task = this.taskRepository.create({
            ...rest,
            userId,
            startDate: start,
            endDate: end
        });

        const savedTask = await this.taskRepository.save(task);

        this.eventEmitter.emit(
            'task.created',
            new TaskCreatedEvent(savedTask.id, savedTask.userId, savedTask.title)
        );

        return this.findOne(savedTask.id);
    }

    async findAll(filters?: {
        search?: string;
        statusId?: number;
        userId?: number;
    }): Promise<Task[]> {
        const whereConditions: any = {};

        if (filters?.statusId) {
            whereConditions.statusId = filters.statusId;
        }

        if (filters?.userId) {
            whereConditions.userId = filters.userId;
        }

        let tasks = await this.taskRepository.find({
            where: whereConditions,
            relations: TASK_RELATIONS,
            order: { startDate: 'DESC' }
        });

        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            tasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                (task.description && task.description.toLowerCase().includes(searchLower))
            );
        }

        return tasks;
    }

    async findOne(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: TASK_RELATIONS
        });

        if (!task) {
            throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
        }

        return task;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.findOne(id);
        const updateData: any = {};

        if (updateTaskDto.startDate || updateTaskDto.endDate || updateTaskDto.userId) {
            const startDate = updateTaskDto.startDate ? parseDate(updateTaskDto.startDate) : task.startDate;
            const endDate = updateTaskDto.endDate ? parseDate(updateTaskDto.endDate) : task.endDate;
            const userId = updateTaskDto.userId || task.userId;

            if (!validateDateRange(startDate, endDate)) {
                throw new BadRequestException(ERROR_MESSAGES.INVALID_DATE_RANGE);
            }

            const hasOverlap = await this.checkOverlap(userId, startDate, endDate, id);
            if (hasOverlap) {
                throw new BadRequestException(ERROR_MESSAGES.TASK_OVERLAP);
            }

            if (updateTaskDto.startDate) updateData.startDate = startDate;
            if (updateTaskDto.endDate) updateData.endDate = endDate;
            if (updateTaskDto.userId) updateData.userId = userId;
        }

        if (updateTaskDto.title) updateData.title = updateTaskDto.title;
        if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description;
        if (updateTaskDto.statusId !== undefined) updateData.statusId = updateTaskDto.statusId;

        await this.taskRepository.update(id, updateData);

        this.eventEmitter.emit(
            'task.updated',
            new TaskUpdatedEvent(id, updateData.userId || task.userId, updateData.title || task.title)
        );

        return this.findOne(id);
    }

    async reassign(id: number, newUserId: number): Promise<Task> {
        const task = await this.findOne(id);
        const oldUserId = task.userId;

        if (oldUserId === newUserId) {
            throw new BadRequestException(ERROR_MESSAGES.SAME_USER_REASSIGN);
        }

        const hasOverlap = await this.checkOverlap(newUserId, task.startDate, task.endDate, id);
        if (hasOverlap) {
            throw new BadRequestException(ERROR_MESSAGES.TASK_OVERLAP);
        }

        await this.taskRepository.update(id, { userId: newUserId });

        this.eventEmitter.emit(
            'task.reassigned',
            new TaskReassignedEvent(id, oldUserId, newUserId, task.title)
        );

        return this.taskRepository.findOne({
            where: { id },
            relations: TASK_RELATIONS
        });
    }

    async remove(id: number): Promise<void> {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
    }
}
