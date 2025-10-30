import { ApiProperty } from '@nestjs/swagger';

class UserDataDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    _id: string;

    @ApiProperty({ example: 'king.becker' })
    username: string;

    @ApiProperty({ example: 'king.becker@example.com' })
    email: string;

    @ApiProperty({ example: '+201234567890' })
    phone: string;

    @ApiProperty({ example: 'King' })
    firstName: string;

    @ApiProperty({ example: 'Becker' })
    lastName: string;

    @ApiProperty({ required: false })
    profile?: any;

    @ApiProperty({ required: false })
    preferences?: any;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    updatedAt: Date;
}

export class AuthResponseDto {
    @ApiProperty({ example: 'User registered successfully' })
    message: string;

    @ApiProperty({ type: UserDataDto })
    user: UserDataDto;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJ1c2VybmFtZSI6ImtpbmcuYmVja2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        description: 'JWT authentication token'
    })
    token: string;
}
