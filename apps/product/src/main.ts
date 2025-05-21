import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from 'apps/microservices/src/app.module';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
 
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3003, // You can change this
    },
    });
  await app.listen();
   console.log('Product Microservice is running on TCP port 3003');
}
bootstrap();
