import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
//We are combining Union types of Product and MongoDB document using mongo urm

export type ProductDocument = Product & Document;
//Creating Schema using Schema Decorator and asking Schema to have an option of timestamps when creating the document
@Schema({ timestamps: true })
export class Product {
  //Using Prop() decorator for validation, used for MongoDB validation for the Mongo Schema
  @Prop({ required: true })
  name: string;
  
  @Prop()
  cat: string;

  @Prop()
  brand: string;

  @Prop()
  color: string;

  @Prop()
  price: string;

  @Prop()
  desc: string;

  @Prop()
  pimg: string;
}
// class being forwarded for MongoDB as a collection through Mongoose Schema
export const ProductSchema = SchemaFactory.createForClass(Product);