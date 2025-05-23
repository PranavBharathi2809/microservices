import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category,CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async create(cat: string, desc: string): Promise<Category> {
    const newCat = new this.categoryModel({ cat, desc });
    return await newCat.save();
  }
  async findByName(cat: string): Promise<Category | null> {
    return this.categoryModel.findOne({ cat }).exec();
  }
  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, cat: string, desc: string): Promise<Category> {
    const updatedCat = await this.categoryModel.findByIdAndUpdate(
      id,
      { cat, desc },
      { new: true },
    );
    if (!updatedCat) {
      throw new NotFoundException('Category not found');
    }
    return updatedCat;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}