
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

// @Injectable() Nest js inject this strategy via dependency injection 
//Create Jwt strategy to validate the token 
//set up the auth guard using passport
//Add @use guard to secure 
//@Req(),or @User to access the current user
@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
   
    constructor(configService: ConfigService) {
      const  secret_key =  configService.get<string>('JWT_SECRET')
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret_key|| 'fallback_secret'
        })
    }
    async validate(payload:any){
         console.log('JWT validated payload:', payload);
        return {Email:payload.Email,role:payload.role}}

}