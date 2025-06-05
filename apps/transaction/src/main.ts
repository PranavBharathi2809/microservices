// apps/transaction/src/main.ts
import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);


   // ✅ Fix for CORS issue
  app.enableCors({
    origin: '*'
  });
  const PORT = process.env.TRANSACTION_PORT || 4005;
  await app.listen(PORT);
  console.log(`Transaction microservice running on port ${PORT}`);
}
bootstrap();
