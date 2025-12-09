import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task-status.entity';
import { AuthController } from './controllers/auth.controller';
import { TaskController } from './controllers/task.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TaskListener } from './listeners/task.listener';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 3306,
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'task_scheduler',
            entities: [User, Task, TaskStatus],
            synchronize: true,
            logging: false
        }),
        TypeOrmModule.forFeature([User, Task, TaskStatus]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
            signOptions: { expiresIn: '7d' }
        }),
        EventEmitterModule.forRoot()
    ],
    controllers: [AuthController, TaskController, UserController],
    providers: [AuthService, TaskService, UserService, JwtStrategy, TaskListener]
})
export class AppModule { }
