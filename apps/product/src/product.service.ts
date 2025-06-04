import { Injectable, InternalServerErrorException, Inject,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddProductDto } from './dto/add-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// We are using Injectable to inject the ProductsService
@Injectable()
export class ProductsService {
  constructor(
    // Injecting Mongo Model and Category_Service to use it for Computation
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject('CATEGORY_SERVICE') private client: ClientProxy,
  ) { }

  // Adding the Product with AddProductDto
  async addProduct(dto: AddProductDto, file: { filename?: string }) {
    try {
      const newProduct = new this.productModel({
        ...dto,
        pimg: file?.filename || '',
      });
      //Saving the product in Mongo 
      await newProduct.save();

      // 1. Check if category exists
      // firstValueForm() --To exchange data from one service to another
      const existingCat = await firstValueFrom(
        this.client.send({ cmd: 'get_category_by_name' }, dto.cat),
      );

      // 2. If not found, create it
      //sending the data to category client proxy
      if (!existingCat) {
        await firstValueFrom(
          this.client.send({ cmd: 'create_category' }, { cat: dto.cat, desc: '' }),
        );
      }

      return {
        msg: 'Product added successfully',
        product: newProduct,
      };
    } catch (err) {
      console.error('Error saving product:', err);
      throw new InternalServerErrorException('Could not save product');
    }
  }

  async getAllProducts() {
  try {
    return await this.productModel.find();
  } catch (err) {
    console.error('Error retrieving products:', err);
    throw new InternalServerErrorException('Could not retrieve products');
  }
}


   async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }



async updateProduct(id: string, updateData: Partial<Omit<Product, 'pimg'>>) {
  try {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedProduct) throw new Error('Product not found');
    return {
      msg: 'Product updated successfully',
      product: updatedProduct,
    };
  } catch (err) {
    console.error('Error updating product:', err);
    throw new InternalServerErrorException('Could not update product');
  }
}



async deleteProduct(id: string) {
  try {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new Error('Product not found');
    return { msg: 'Product deleted successfully', product: deleted };
  } catch (err) {
    console.error('Error deleting product:', err);
    throw new InternalServerErrorException('Could not delete product');
  }
}

}