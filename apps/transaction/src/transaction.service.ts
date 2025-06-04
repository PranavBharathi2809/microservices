// apps/transaction/src/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createPaymentDto);
    console.log('Received DTO:', createPaymentDto);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findByEmail(email: string): Promise<Transaction[]> {
    return this.transactionModel.find({ email }).exec();
  }
}
