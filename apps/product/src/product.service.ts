
import { Injectable,InternalServerErrorException, UploadedFile, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { AddProductDto } from './dto/add-product.dto';
import { File as MulterFile } from 'multer';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

   async addProduct(dto: AddProductDto, file: MulterFile) {
        try {
            const newProduct = new this.productModel({
                ...dto,
                pimg: file?.filename || '',
            });

            await newProduct.save();
            return { msg: 'prod added' };
        } catch (err) {
            console.error('Error saving product:', err);
            throw new InternalServerErrorException('Could not save product');
        }
    }
  // async create(data: Partial<Product>): Promise<Product> {
  //   const newProduct = new this.productModel(data);
  //   return await newProduct.save();
  // }

  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateById(id: string, updateData: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return updatedProduct;
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: 'Product deleted successfully' };
  }

  async deleteAll(): Promise<{ message: string }> {
    const result = await this.productModel.deleteMany({});
    return { message: `${result.deletedCount} product(s) deleted successfully` };
  }
}
