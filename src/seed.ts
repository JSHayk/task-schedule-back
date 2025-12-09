import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { TaskStatus } from './entities/task-status.entity';
import { Task } from './entities/task.entity';
import { addDays } from './utils/date.utils';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'task_scheduler',
    entities: [User, Task, TaskStatus],
    synchronize: true
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');

        const userRepo = AppDataSource.getRepository(User);
        const statusRepo = AppDataSource.getRepository(TaskStatus);
        const taskRepo = AppDataSource.getRepository(Task);

        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
        await taskRepo.clear();
        await userRepo.clear();
        await statusRepo.clear();
        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');


        const statuses = await statusRepo.save([
            { name: 'TODO' },
            { name: 'IN_PROGRESS' },
            { name: 'DONE' },
            { name: 'CANCELLED' }
        ]);
        console.log('✅ Task statuses seeded');

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('password123', 10);

        const users = await userRepo.save([
            {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User'
            },
            {
                email: 'john@example.com',
                password: hashedUserPassword,
                name: 'John Doe'
            },
            {
                email: 'jane@example.com',
                password: hashedUserPassword,
                name: 'Jane Smith'
            },
            {
                email: 'bob@example.com',
                password: hashedUserPassword,
                name: 'Bob Johnson'
            }
        ]);
        console.log('✅ Users seeded');

        const today = new Date();

        await taskRepo.save([
            {
                title: 'Setup project infrastructure',
                description: 'Initialize the project with NestJS and Vue 3',
                startDate: today,
                endDate: addDays(today, 1),
                statusId: statuses[1].id,
                userId: users[1].id
            },
            {
                title: 'Design database schema',
                description: 'Create ERD and define relationships',
                startDate: addDays(today, 2),
                endDate: addDays(today, 3),
                statusId: statuses[0].id,
                userId: users[2].id
            },
            {
                title: 'Implement authentication',
                description: 'JWT-based auth with login/logout',
                startDate: addDays(today, 4),
                endDate: addDays(today, 5),
                statusId: statuses[0].id,
                userId: users[3].id
            }
        ]);
        console.log('✅ Sample tasks seeded');

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📧 Login credentials:');
        console.log('   Admin: admin@example.com / admin123');
        console.log('   Users: john@example.com / password123');
        console.log('          jane@example.com / password123');
        console.log('          bob@example.com / password123\n');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
