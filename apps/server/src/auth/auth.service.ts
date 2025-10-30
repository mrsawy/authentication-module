import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {

    const createdUser = await this.userService.create(registerDto);
    const token = this.generateToken(createdUser.toObject());
    const { password, ...userData } = createdUser.toObject()
    return {
      message: 'User registered successfully',
      user: userData,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const foundedUser = await this.userService.findOne(loginDto.identifier);
    const isMatch = await bcrypt.compare(loginDto.password, foundedUser?.password);
    if (!isMatch) {
      throw new Error("Wrong Password")
    }
    if (!foundedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(foundedUser.toObject());

    const { password, ...userData } = foundedUser.toObject()
    return {
      message: 'Logged in successfully',
      user: userData,
      token,
    };
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);   // uses config from module
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
