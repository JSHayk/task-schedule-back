import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: { id: true, email: true, name: true, createdAt: true }
        });
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({
            where: { id },
            select: { id: true, email: true, name: true, createdAt: true }
        });
    }
}
