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

        })


],
  exports:[AuthService,JwtStartegy],
  controllers: [AuthController],
  providers: [AuthService, JwtStartegy]
})
export class AuthModule {}
