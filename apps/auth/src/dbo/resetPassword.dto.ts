import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}