import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'apps/common/guards/roles.guard';
import { Roles } from 'apps/common/decorators/roles.decorator';
import { CreateCategoryDto } from 'apps/auth/src/dbo/create-category.dto';
import { UpdateCategoryDto } from 'apps/auth/src/dbo/update-category.dto';
    import { Category } from './schemas/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('customer','admin')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }


   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin' ,'customer')
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }


   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','customer')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','customer')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateById(id, updateCategoryDto);
  }


   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','customer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }


   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','customer')
  @Delete()
  removeAll() {
    return this.categoryService.deleteAll();
  }
}
