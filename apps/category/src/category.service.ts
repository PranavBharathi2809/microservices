import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async updateById(id: string, updateData: Partial<Category>): Promise<Category> {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return updatedCategory;
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return { message: 'Category deleted successfully' };
  }

  async deleteAll(): Promise<{ message: string }> {
    const result = await this.categoryModel.deleteMany({});
    return { message: `${result.deletedCount} category(ies) deleted successfully` };
  }
}
