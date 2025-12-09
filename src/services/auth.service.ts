import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { ERROR_MESSAGES } from '../utils/constants';
import { sanitizeUser } from '../utils/user.utils';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }

        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const payload = { sub: user.id, email: user.email, name: user.name };

        return {
            access_token: this.jwtService.sign(payload),
            user: sanitizeUser(user)
        };
    }
}
