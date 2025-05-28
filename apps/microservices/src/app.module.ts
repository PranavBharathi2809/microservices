import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'apps/user/src/users.module';
import { ProductsModule } from 'apps/product/src/product.module';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
@Module({

imports:[


    ClientsModule.register([
 
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8080,
        },
      },
 
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8080,
        },
      },
 
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8080,
        },
      },
 
      {
        name: 'CATEGORY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8080,
        },
      },
 
    ]),
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
