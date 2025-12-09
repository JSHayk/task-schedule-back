import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent, TaskUpdatedEvent, TaskReassignedEvent } from '../events/task.events';

@Injectable()
export class TaskListener {
    @OnEvent('task.created')
    async handleTaskCreated(event: TaskCreatedEvent) {
        console.log(`[NOTIFICATION] Task "${event.title}" created for user ${event.userId}`);
        console.log(`[BACKGROUND JOB] Updating availability for user ${event.userId}`);
    }

    @OnEvent('task.updated')
    async handleTaskUpdated(event: TaskUpdatedEvent) {
        console.log(`[NOTIFICATION] Task "${event.title}" updated for user ${event.userId}`);
        console.log(`[BACKGROUND JOB] Updating availability for user ${event.userId}`);
    }

    @OnEvent('task.reassigned')
    async handleTaskReassigned(event: TaskReassignedEvent) {
        console.log(`[NOTIFICATION] Task "${event.title}" reassigned from user ${event.oldUserId} to user ${event.newUserId}`);
        console.log(`[BACKGROUND JOB] Updating availability for users ${event.oldUserId} and ${event.newUserId}`);
    }
}
