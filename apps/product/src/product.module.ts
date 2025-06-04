// products.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsGatewayController } from './product.controller';
import { AuthModule } from 'apps/auth/src/auth.module';
import { JwtAuthGuard } from 'apps/common/guards/jwt-auth.guard';
import { RolesGuard } from 'apps/common/guards/roles.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/product/.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    // ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   ClientsModule.registerAsync([
     {
      name:"CATEGORY_SERVICE",
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({

        transport: Transport.TCP,
        options:{
          host: config.get<string>('CATEGORY_SERVICE_HOST'),
          port: config.get<number>('CATEGORY_SERVICE_PORT')
        }
      }

      )
      
     }
  ]),
    AuthModule,
  ],
  controllers: [ProductsGatewayController],
  providers: [ProductsService, /*RolesGuard,*/
    /* JwtAuthGuard*/],
})
export class ProductsModule { }