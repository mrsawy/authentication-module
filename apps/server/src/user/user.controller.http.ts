import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserRequest } from 'src/auth/interfaces/IUserRequest.interface';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';


@ApiTags('User')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get current user data',
    description: 'Retrieves the authenticated user\'s profile information. Requires a valid JWT token in the Authorization header.'
  })
  @ApiResponse({
    status: 200,
    description: 'User data fetched successfully',
    type: UserResponseDto,
    example: {
      message: 'User data fetched successfully',
      user: {
        _id: '507f1f77bcf86cd799439011',
        username: 'king.becker',
        email: 'king.becker@example.com',
        phone: '+201234567890',
        firstName: 'King',
        lastName: 'Becker',
        profile: {
          bio: 'Software developer',
          dateOfBirth: '1990-01-15T00:00:00.000Z',
          address: {
            detailedAddress: '123 Main St',
            city: 'Cairo',
            state: 'Cairo',
            zipCode: '11511',
            country: 'Egypt'
          },
          socialLinks: {
            linkedin: 'https://linkedin.com/in/kingbecker',
            twitter: 'https://twitter.com/kingbecker'
          }
        },
        preferences: {
          language: 'en',
          darkMode: true
        },
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
    example: {
      statusCode: 401,
      message: 'Invalid token',
      error: 'Unauthorized'
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found'
    }
  })
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