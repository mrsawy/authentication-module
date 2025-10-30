import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { ClientSession, Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, Number(process.env.SALT_ROUNDS));
      return await this.userModel.create({ ...createUserDto, password: hashedPassword });
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ConflictException(`${field} "${error.keyValue[field]}" already exists.`);
      }
      throw error;
    }
  }


  async findOne(identifier: string) {
    let foundedUser: User | null = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      foundedUser = await this.userModel.findById(identifier)
    } else {
      foundedUser = await this.userModel
        .findOne({
          $or: [{ email: identifier }, { username: identifier }, { phone: identifier }]
        })
    }
    if (!foundedUser) throw new NotFoundException("User Not Found")
    return foundedUser;
  }


}
