import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @MessagePattern({ cmd: 'get_category_by_name' })
  async findByName(@Payload() cat: string) {
    return this.categoryService.findByName(cat);
  }

  @MessagePattern({ cmd: 'create_category' })
  async create(@Payload() data: { cat: string; desc: string }) {
    const { cat, desc } = data;
    return await this.categoryService.create(cat, desc);
  }

  @MessagePattern({ cmd: 'get_all_categories' })
  async findAll() {
    return await this.categoryService.findAll();
  }

  @MessagePattern({ cmd: 'get_category_by_id' })
  async findOne(@Payload() id: string) {
    return await this.categoryService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_category' })
  async update(@Payload() data: { id: string; cat: string; desc: string }) {
    return await this.categoryService.update(data.id, data.cat, data.desc);
  }

  @MessagePattern({ cmd: 'delete_category' })
  async remove(@Payload() id: string) {
    return await this.categoryService.delete(id);
  }
}