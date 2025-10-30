import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

    @ApiProperty({
        description: "Email or username used for login",
        example: "king.becker"
    })
    @IsString()
    @IsNotEmpty()
    identifier: string;

    @ApiProperty({
        description: "User password",
        example: "Password123"
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
