import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);



  //allow all origins to connect 
  app.enableCors({
   origin:'*', 
   credentials:true //cookies,authorization
  })


  
    // adding ConfigService as middleware for .env configs
    const config = app.get(ConfigService)
    // registering the port no. for product HTTP
    const port = config.get<number>("AUTH_PORT")
  // TCP communication (Interservice) & registering TCP microservices
    // setting up the port no. for TCP communication for other services to communicate to Product
    const tcpPort = config.get<number>("AUTH_TCP_PORT")
    // register TCP microservice
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: config.get<string>("AUTH_TCP_HOST"),
        port: tcpPort
      }
    })
  
    //Start TCP microservice
    await app.startAllMicroservices()


  await app.listen(port ?? 3000);
  console.log("AUTH micro service listening on port 3000")
}
bootstrap();
