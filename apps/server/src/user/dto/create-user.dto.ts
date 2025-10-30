import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsObject, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    detailedAddress?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    zipCode?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;
}

export class SocialLinksDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    linkedin?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    twitter?: string;
}

export class ProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    dateOfBirth?: Date;

    @ApiPropertyOptional({ type: () => AddressDto })
    @IsOptional()
    @IsObject()
    @Type(() => AddressDto)
    address?: AddressDto;

    @ApiPropertyOptional({ type: () => SocialLinksDto })
    @IsOptional()
    @IsObject()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;
}

export class PreferencesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    language?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    darkMode?: boolean;
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'email@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+201234567890' })
    @IsNotEmpty()
    @Matches(/^\+?\d+$/, { message: 'Phone must contain only digits and may start with +' })
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ type: () => ProfileDto })
    @IsOptional()
    @IsObject()
    @Type(() => ProfileDto)
    profile?: ProfileDto;

    @ApiPropertyOptional({ type: () => PreferencesDto })
    @IsOptional()
    @IsObject()
    @Type(() => PreferencesDto)
    preferences?: PreferencesDto;
}
