import { User } from '../entities/user.entity';

export function sanitizeUser(user: User) {
    return {
        id: user.id,
        email: user.email,
        name: user.name
    };
}

export const USER_SELECT_FIELDS = ['id', 'email', 'name', 'createdAt'];
