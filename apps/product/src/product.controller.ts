import { Controller, Post, UseGuards ,Body,Get,Delete,Put,Param,UseInterceptors,  UploadedFile} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'apps/common/guards/roles.guard';
import { Roles } from 'apps/common/decorators/roles.decorator';
import { CreateProductDto } from 'apps/auth/src/dbo/create-product.dto';
import { UpdateProductDto } from 'apps/auth/src/dbo/updateProduct.dto';
import { FileInterceptor} from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { AddProductDto } from './dto/add-product.dto';
import { File as MulterFile } from 'multer';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Controller('product')
export class ProductController {
  constructor(@Inject('PRODUCT_SERVICE')private readonly client: ClientProxy) {}

  // @UseGuards(AuthGuard('jwt'),RolesGuard)
  // @Roles('customer')
  // @Post()
  // async create(@Body() createProductDto: CreateProductDto) {
  //   return this.productService.create(createProductDto);
  // }



  // Define a POST HTTP route handler for the path 'add' 
   @Post('add')
//   @UseInterceptors(FileInterceptor('file'))



// Apply an interceptor to handle file uploads using Multer
// `FileInterceptor` intercepts the request, extracts the file from the 'denim4' field, and applies the multerConfig settings
  @UseInterceptors(FileInterceptor('denim4', multerConfig))
  

  // Define the controller method 'addProduct' that will be executed when a POST request hits the 'add' route
  async addProduct(

    // Extract the request body and map it to the AddProductDto class to validate/transform the input
    @Body() body: AddProductDto,

    // Extract the uploaded file and inject it into the method using the @UploadedFile() decorator
    @UploadedFile() file: MulterFile
  ) {

      const filename = file?.filename || '';
    const response = await this.client
      .send({ cmd: 'add-product' }, { dto: body, filename })
      .toPromise();

    return response;
  }
}



//   @UseGuards(AuthGuard('jwt'),RolesGuard)
//   @Roles('customer','admin')
//   @Get()
//   findAll() {
//     return this.ProductService.findAll();
//   }

//   @UseGuards(AuthGuard('jwt'),RolesGuard)
//   @Roles('customer','admin')
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.ProductService.findById(id);
//   }


//    @UseGuards(AuthGuard('jwt'),RolesGuard)
//   @Roles('admin')
//   @Put(':id')
//   update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
//     return this.ProductService.updateById(id, updateProductDto);
//   }

//   @UseGuards(AuthGuard('jwt'),RolesGuard)
//   @Roles('customer','admin')
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.ProductService.deleteById(id);
//   }



//   @UseGuards(AuthGuard('jwt'),RolesGuard)
//   @Roles('customer','admin')
//   @Delete()
//   removeAll()
//   {
//     return this.ProductService.deleteAll();
//   }


  
// }
