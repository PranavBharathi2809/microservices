import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { UsersModule } from 'apps/user/src/users.module';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStartegy } from './strategies/jwt.strategy';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import config from "process";
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"


@Module({
  imports:[
   
     ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/auth/.env',
        }),


    
    ClientsModule.registerAsync([
     {
      name:"USER_SERVICE",
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({

        transport: Transport.TCP,
        options:{
          host: config.get<string>('USER_SERVICE_HOST'),
          port: config.get<number>('USER_SERVICE_PORT')
        }
      }

      )
      
     }
  ]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
 JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (ConfigService: ConfigService) => {
                return {
                    secret: "Jfadsdaskjkafsd",
                    signOptions: {
                        expiresIn: "1d"
                    }
                };
            }

        }),
     
    // NodeMailer
        MailerModule.forRoot({
            transport: {
                host: "smtp.gmail.com",
                //   port: 587,
                secure: true, // true for port 465, false for other ports
                auth: {
                    user : "m.pranavbharathi@gmail.com",
                    pass : "eahekviaeficlrgy"
                },
            },
            defaults: {
                from: "No Reply <no-reply@example.com>"
            },
            template: {
                dir: join(__dirname, '..', 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
],
  exports:[AuthService,JwtStartegy],
  controllers: [AuthController],
  providers: [AuthService, JwtStartegy]
})
export class AuthModule {}
