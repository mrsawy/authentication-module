import { Controller, ConflictException, UnauthorizedException, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { RpcValidationPipe } from 'src/utils/RpcValidationPipe';

import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./auth.guard";
import { handleRpcError } from "src/utils/errorHandling";
import { RegisterDto } from "./dto/register.dto";

@Controller()
export class AuthControllerMessage {
    constructor(private authService: AuthService) { }

    @MessagePattern('auth.register')
    async register(
        @Payload(new RpcValidationPipe())
        registerDto: RegisterDto,
    ) {
        try {
            return await this.authService.register(registerDto);
        } catch (error) {
            handleRpcError(error)
        }
    }

    @MessagePattern('auth.login')
    async login(
        @Payload(new RpcValidationPipe())
        loginDto: LoginDto,
    ) {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            handleRpcError(error)
        }
    }
}
