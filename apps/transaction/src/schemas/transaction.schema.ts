// src/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;
@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ type: Object, required: true })
  transaction: {id:string}; // or any, but better use Record
}


export const TransactionSchema = SchemaFactory.createForClass(Transaction);
