import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'apps/user/src/users.module';
import { ProductsModule } from 'apps/product/src/product.module';
@Module({

imports:[
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRootAsync({
      imports:[ConfigModule,ProductsModule],
      inject:[ConfigService],
      useFactory: async (config:ConfigService)=> ({
 
        uri:config.get<string>('MONGO_URI')
         
      })
    }),
    UsersModule
  ],


  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
