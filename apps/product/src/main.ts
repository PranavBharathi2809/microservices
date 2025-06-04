import { NestFactory } from "@nestjs/core";
import { ProductsModule } from "./product.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Post } from "@nestjs/common";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  //HTTP communication between Postman and product
  //this is the http layer
  // const app = await NestFactory.create(ProductsModule)
  const app = await NestFactory.create<NestExpressApplication>(ProductsModule);

  app.enableCors({
    origin: '*',
    credentials: true //cookies,authorization
  })



  // adding ConfigService as middleware for .env configs
  const config = app.get(ConfigService)
  // registering the port no. for product HTTP
  const port = config.get<number>("PRODUCT_PORT")


  // TCP communication (Interservice) & registering TCP microservices
  // setting up the port no. for TCP communication for other services to communicate to Product
  const tcpPort = config.get<number>("PRODUCT_TCP_PORT")
  // register TCP microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: config.get<string>("PRODUCT_TCP_HOST"),
      port: tcpPort
    }
  })

  app.useStaticAssets(join(process.cwd(), "prodimgs"), {
  prefix: "/prodimgs/",
});


  //Start TCP microservice
  await app.startAllMicroservices()
  //Start HTTP server for image, upload, and CRUD ops.
  await app.listen(port || 3002)
  console.log("Product micro service listening on port 3002")

}
bootstrap();