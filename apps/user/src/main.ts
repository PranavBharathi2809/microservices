import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices"
import { ConfigService } from '@nestjs/config';
async function bootstrap() {


 //HTTP communication between Postman and product
  //this is the http layer
  const app = await NestFactory.create(UsersModule)

  app.enableCors({
    origin: '*',
    credentials: true //cookies,authorization
  })



  // adding ConfigService as middleware for .env configs
  const config = app.get(ConfigService)
  // registering the port no. for product HTTP
  const port = config.get<number>("USER_PORT")


  // TCP communication (Interservice) & registering TCP microservices
  // setting up the port no. for TCP communication for other services to communicate to Product
  const tcpPort = config.get<number>("USER_TCP_PORT")
  // register TCP microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: config.get<string>("USER_TCP_HOST"),
      port: tcpPort
    }
  })

  //Start TCP microservice
  await app.startAllMicroservices()
  //Start HTTP server for image, upload, and CRUD ops.
  await app.listen(port || 3001)
  console.log("user micro service listening on port 3001")


}














  
//   const app = await NestFactory.createMicroservice(UsersModule,
//     {
//       transport:Transport.TCP, 
//       options:{
//         host:"127.0.0.1",
//         port:3001
        
//       }});



//       await app.listen()
//       console.log("User Micro service listenening on port 3001")
// }
  
bootstrap();
