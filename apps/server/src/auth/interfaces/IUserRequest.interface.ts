import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface IUserRequest extends Request {
    user: User;
}
