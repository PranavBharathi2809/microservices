import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Category.name, schema: CategorySchema },
    // ]),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:(config:ConfigService)=>(
        {
          uri: config.get<string>('MONGO_URI'),
          useNewUrlParser:true,
          useUnifiedTopology:true
        }
      ) ,
      
    }),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService], // optional, if used in other modules
})
export class CategoryModule {}
