import { Inject,Module, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { Injectable,ConflictException } from '@nestjs/common';
import { UsersService } from 'apps/user/src/users.service';
import { registerDbo } from './dbo/register.dbo';
import * as bcrypt from 'bcrypt';
import { loginDto} from './dbo/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User,userDocument } from 'apps/user/src/schemas/user.schema';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class AuthService { 
    // User services dependency that we are injecting for authentication services 
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy,private jwtService:JwtService){ }
    //tight coupling
    // private userService: UsersService
    // private jwtService: JwtService
    // constructor(){
        
    //     this.userService = new UsersService()
    //     this.jwtService = new JwtService({
    //         secret:'hardcoded'
    //     })
    // }
    async register(registerDbo: registerDbo){

        if (!registerDbo) {
    throw new BadRequestException('No data provided');
  }
        const {Name, Email,Password,role}  = registerDbo

        const existingUser = await firstValueFrom(
            this.userClient.send({cmd:'find-by-email'}, Email)
        )
        // const existingUser = await this.userService.findbyEmail(Email)
        if(existingUser)
        {
            throw new ConflictException('Email already Registered')
        }
        const hashedPassword = await bcrypt.hash(Password,10);
        console.log(hashedPassword)
        const user = await firstValueFrom(
             this.userClient.send(
            { cmd: 'creating' },
            { Name, Email, Password: hashedPassword, role }
  )
);

        //  const user = await this.userService.create({
        //    Name,Email,Password:hashedPassword,role,
        // })
        return {message:'User registered Successfully',user:{Name:user.Name, Email:user.Email,role:user.role}}
    }

    async login (loginDto:loginDto){
        const {Email,Password} = loginDto

        console.log(Email)
        const user = await firstValueFrom(
            this.userClient.send({cmd:'find-by-email'}, Email)
        )
        
        // const user = await this.userService.findbyEmail(Email)
        if(!user)
        {
           throw  new UnauthorizedException("Invalid Credentails")
        }
        const isMatch = await bcrypt.compare(Password,user!.Password)
        if(!isMatch)
        {
           throw new UnauthorizedException("Invalid Password")
        }
        const payload ={
            Email:user?.Email,
            role:user?.role,

        }
        const token = this.jwtService.sign(payload);
        return {
            message: 'User login successfullt',
            accessToken:token,
            user:{
            Name:user?.Name, 
            Email:user?.Email,
            role:user?.role
            }
        }
    }

     async validatePayload(payload: any) {
    return {
      emailid: payload.emailid,
      role: payload.role,
    }
  }
}
