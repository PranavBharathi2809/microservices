import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type userDocument = User & Document

@Schema({timestamps:true})
export class User{
  @Prop({required:true, unique:true})
  Name: string

  @Prop({required:true, unique:true})
  Email: string
  @Prop({required:true})
  Password: string

  @Prop({default:'customer'})
  role : 'customer' |'admin'
}


export const UserSchema= SchemaFactory.createForClass(User)