// add-product.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

// Just for class validation

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

   @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  price: string; // Note: It comes as string from form-data

  @IsString()
  @IsNotEmpty()
  cat: string;

   @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  desc: string;
}