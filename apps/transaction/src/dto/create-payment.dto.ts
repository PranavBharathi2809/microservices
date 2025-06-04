// src/dto/create-payment.dto.ts
export class CreatePaymentDto {
  email: string;
  transaction: {id:string}; // You can narrow this to string if you only receive transaction ID
}
