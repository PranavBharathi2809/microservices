// Data Validation
import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    Email: string;
}