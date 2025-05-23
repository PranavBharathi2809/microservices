import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CategoryModule } from './category.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  //HTTP communication between Postman and product
      //this is the http layer
      const app = await NestFactory.create(CategoryModule)

      app.enableCors({
   origin:'*', 
   credentials:true //cookies,authorization
  })


      // adding ConfigService as middleware for .env configs
      const config = app.get(ConfigService) 
      // registering the port no. for product HTTP
      const port = config.get<number>("CATEGORY_PORT")
    
  
    // TCP communication (Interservice) & registering TCP microservices
      // setting up the port no. for TCP communication for other services to communicate to Product
      const tcpPort = config.get<number>("CATEGORY_TCP_PORT")
      // register TCP microservice
      app.connectMicroservice<MicroserviceOptions>({
        transport : Transport.TCP,
        options: {
          host : config.get<string>("CATEGORY_TCP_HOST"),
          port : tcpPort
        }
      })
      
      //Start TCP microservice
      await app.startAllMicroservices()

  await app.listen(port || 3003);
  console.log('Category microservice is running on TCP port 3003');
}
bootstrap();