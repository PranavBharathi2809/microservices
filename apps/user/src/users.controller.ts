import {
  Controller, // Used to define a controller
  Get,        // Used to handle HTTP GET requests
  Post,       // Used to handle HTTP POST requests
  Put,        // Used to handle HTTP PUT requests
  Delete,     // Used to handle HTTP DELETE requests
  Param,      // Used to extract route parameters (e.g., :id)
  Body,       // Used to extract the body of the request
  Query,      // Used to extract query parameters (e.g., ?email=value)
} from '@nestjs/common';

// Importing the UsersService which contains business logic for user operations
import { UsersService } from './users.service';

// Importing the User schema (type) used for typing the request/response data
import { User } from './schemas/user.schema';
import { MessagePattern,Payload } from '@nestjs/microservices';


// Declares this class as a controller and sets its base route to '/user'
@Controller('user')
export class UserController {

  // Injects the UsersService into the controller via constructor
  constructor(private readonly userService: UsersService) { }


  // @MessagePattern({cmd:'find-by-email'})
  // async findbyEmail(email:string){
  //   return this.userService.findbyEmail(email)
  // }

  //POST /user → Creates a new user
  //@Post()
  @MessagePattern({ cmd: 'creating' })
  createMicroservice(@Body() data: Partial<User>) // Extracts request body and types it as Partial<User> (some or all fields optional)
  {

    // Delegates to the service method to handle user creation
    return this.userService.create(data);
  }



 @MessagePattern({ cmd: 'find-by-email' })
  async findbyEmail(@Body() Email: string) {
    return this.userService.findbyEmail(Email);
  }


   @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getall();
  }

  //@Put(':id')
  @MessagePattern({ cmd: 'updating' })
  update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.userService.updateById(id, updateData);
  }


  //@Delete(':id')
  @MessagePattern({ cmd: 'deleting' })
  delete(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }


  // @Delete()
  @MessagePattern({ cmd: 'deletingAll' })
  deleteAll() {
    return this.userService.deleteAll();
  }

  @MessagePattern({ cmd: 'update-password' })
async handleUpdatePassword(@Payload() payload: { email: string; password: string }) {
  return this.userService.updatePassword(payload);
}


}