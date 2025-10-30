import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { IUserContext } from 'src/auth/interfaces/IUserContext.interface';


@Controller()
export class UserControllerMessage {

    constructor(private readonly userService: UserService) { }

    @MessagePattern("user.getOwnData")
    @UseGuards(AuthGuard)
    async findOwnData(
        @Ctx() context: IUserContext
    ) {
        const user = context.userPayload;
        const foundedUser = await this.userService.findOne(user._id as string);
        const { password, ...userData } = foundedUser;
        return {
            message: 'User data fetched successfully',
            user: userData,
        };
    }


}
