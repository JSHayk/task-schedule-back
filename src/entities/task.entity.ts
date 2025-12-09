import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { TaskStatus } from './task-status.entity';

@Entity('tasks')
@Index(['userId', 'startDate', 'endDate'])
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column()
    statusId: number;

    @Column()
    userId: number;

    @ManyToOne(() => TaskStatus, status => status.tasks)
    @JoinColumn({ name: 'statusId' })
    status: TaskStatus;

    @ManyToOne(() => User, user => user.tasks)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
