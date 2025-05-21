import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  size: string[];

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsBoolean()
  inStock: boolean;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
