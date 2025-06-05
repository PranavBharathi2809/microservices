import { Controller , Post, Body,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDbo } from './dbo/register.dbo';
import { loginDto } from './dbo/login.dto';
import { Roles } from 'apps/common/decorators/roles.decorator';
import { RolesGuard } from 'apps/common/guards/roles.guard';
import { JwtAuthGuard } from 'apps/common/guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dbo/forgotPassword.dto';
import { ResetPasswordDto } from './dbo/resetPassword.dto';
@Controller('auth')
export class AuthController {

constructor(private authService:AuthService){}

@Post("register")

register(@Body() dbo:registerDbo){
    return this.authService.register(dbo)
}

@Post("login")
login(@Body() dto:loginDto)
{
    return this.authService.login(dto)
}

 @Post('validate')
    async validateToken(@Body('payload') payload: any) {
    return this.authService.validatePayload(payload);
  }

   @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendResetLink(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}