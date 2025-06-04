// apps/transaction/src/transaction.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

  @Get('by-email')
  async findByEmail(@Query('email') email: string) {
    return this.transactionService.findByEmail(email);
  }
}
