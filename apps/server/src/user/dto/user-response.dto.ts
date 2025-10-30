import { ApiProperty } from '@nestjs/swagger';
export class UserResponseDto {
  @ApiProperty({ example: 'User data fetched successfully' })
  message: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  user: any;
}