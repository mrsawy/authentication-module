import { NatsContext } from '@nestjs/microservices';
import { User } from 'src/user/entities/user.entity';


export interface IUserContext extends NatsContext {
    userPayload: User;
}
