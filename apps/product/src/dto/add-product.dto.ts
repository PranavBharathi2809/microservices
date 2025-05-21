// add-product.dto.ts
import { IsString, IsNumber,IsNotEmpty , IsBoolean} from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string; // Note: It comes as string from form-data

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  color: string;

   @IsNumber()
   @IsNotEmpty()
   price: number;

   @IsBoolean()
   @IsNotEmpty()
   instock:boolean;
   
  
  
 
}