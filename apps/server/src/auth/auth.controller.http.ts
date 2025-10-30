import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials and profile information. Returns user data and JWT token upon successful registration.'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: AuthResponseDto,
    example: {
      message: 'User registered successfully',
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
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation failed',
    example: {
      statusCode: 400,
      message: [
        'email must be an email',
        'password should not be empty',
        'Phone must contain only digits and may start with +'
      ],
      error: 'Bad Request'
    }
  })
  @ApiConflictResponse({ 
    description: 'User with this email, username, or phone already exists',
    example: {
      statusCode: 409,
      message: 'User with this email already exists',
      error: 'Conflict'
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error',
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error'
    }
  })
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticates a user with their email/username and password. Returns user data and JWT token upon successful authentication.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Logged in successfully',
    type: AuthResponseDto,
    example: {
      message: 'Logged in successfully',
      user: {
        _id: '507f1f77bcf86cd799439011',
        username: 'king.becker',
        email: 'king.becker@example.com',
        phone: '+201234567890',
        firstName: 'King',
        lastName: 'Becker',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    example: {
      statusCode: 400,
      message: ['identifier should not be empty', 'password should not be empty'],
      error: 'Bad Request'
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials',
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized'
    }
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
