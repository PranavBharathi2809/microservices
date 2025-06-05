import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { registerDbo } from './dbo/register.dbo';
import { loginDto } from './dbo/login.dto';
import { ForgotPasswordDto } from './dbo/forgotPassword.dto';
import { ResetPasswordDto } from './dbo/resetPassword.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, private readonly mailerService: MailerService
  ) {}

  async register(registerDbo: registerDbo) {
    if (!registerDbo) {
      throw new BadRequestException('No data provided');
    }

    const { Name, Email, Password, role } = registerDbo;

    const existingUser = await firstValueFrom(
      this.userClient.send({ cmd: 'find-by-email' }, Email),
    );

    if (existingUser) {
      throw new ConflictException('Email already Registered');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'creating' }, {
        Name,
        Email,
        Password: hashedPassword,
        role,
      }),
    );

    return {
      message: 'User registered successfully',
      user: { Name: user.Name, Email: user.Email, role: user.role },
    };
  }

  async login(loginDto: loginDto) {
    const { Email, Password } = loginDto;

    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'find-by-email' }, Email),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = {
      Email: user.Email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'User login successfully',
      accessToken: token,
      user: {
        Name: user.Name,
        Email: user.Email,
        role: user.role,
      },
    };
  }
  async sendResetLink(forgotPasswordDto: ForgotPasswordDto) {
    const { Email } = forgotPasswordDto
    const user = await firstValueFrom(
      this.userClient.send(
        { cmd: 'find-by-email' },
        Email
      )
    )
    if (!user) {
      throw new NotFoundException("Email id not found")
    }

    const jwtSecret = this.configService.get('JWT_SECRET')
    const payload = { Email: user?.Email }
    const token = this.jwtService.sign(payload)
    const resetLink = `http://${this.configService.get<string>('RESET_LINK')}:${this.configService.get<string>('RESET_LINK_PORT')}/reset-password?token=${token}`;


    await this.mailerService.sendMail({
      to: user.Email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    });
    return {
      message: "Reset Link send successfully"
    }

  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token); // Decode and verify token
      const Email = decoded.Email;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in User service via microservice call
      const result = await firstValueFrom(
        this.userClient.send(
          { cmd: 'update-password' },
          { Email, Password: hashedPassword }
        )
      );

      return {
        message: 'Password updated successfully',
        result
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
  }
   async validatePayload(payload: any) {
    return {
      emailid: payload.emailid,
      role: payload.role,
    }
}
}
