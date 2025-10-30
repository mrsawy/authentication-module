import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/interfaces/IUserRequest.interface';
import { UserService } from './user.service';


@Controller()
export class UserControllerMessage {

    constructor(private readonly userService: UserService) { }
    
    @MessagePattern("user.getOwnData")
    @UseGuards(AuthGuard)
    async findOwnData(@Request() req: IUserRequest) {
        const user = req.user;
        const foundedUser = await this.userService.findOne(user._id as string);
        const { password, ...userData } = foundedUser;
        return {
            message: 'User data fetched successfully',
            user: userData,
        };
    }


}
