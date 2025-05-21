import { Controller , Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDbo } from './dbo/register.dbo';
import { loginDto } from './dbo/login.dto';

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
}