import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User} from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
 @Module({
     imports: [
        ConfigModule.forRoot({ isGlobal: true,  envFilePath: 'apps/user/.env' }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('MONGO_URI')
            })
        }),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }])
    ],

    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule { }