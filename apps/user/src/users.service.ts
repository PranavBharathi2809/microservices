// Marks this class as available for dependency injection
import { Injectable, NotFoundException } from '@nestjs/common';

// Decorator to inject a Mongoose model into the service
import { InjectModel} from '@nestjs/mongoose';

// Import the User schema and its corresponding document type
import { User, userDocument} from './schemas/user.schema';

// Import the base Model type from Mongoose
import { Model } from 'mongoose'; 


// Marks this class as a provider that can be injected
@Injectable()
export class UsersService {

    // Constructor injects the Mongoose model for 'User'
    constructor(@InjectModel(User.name) private userModel:Model<userDocument>){}
    

        // Find a user document by email (returns User or null)
        async findbyEmail(Email:string):Promise<User |null>{
          const user = await  this.userModel.findOne({Email})
           return user;
           console.log("check",user)
        }

        
     // Create and save a new user document
     //data: Partial<User> – The input is an object with some or all of the fields of a User. The Partial<User> type means all properties are optional.
     //new this.userModel(data) creates a new instance of the User document using the provided data.
    async create(data:Partial<User>):Promise<User>{
        const newUser = new this.userModel(data)
        return newUser.save()
    }


    //get all users
    async getall(): Promise<User[]> {
        return this.userModel.find().exec();
    }
    //async – Marks this method as asynchronous, so you can use await inside it.
    //updateById(...) – This function updates a user in the database by their ID.
    //id: string – This is the unique MongoDB document ID you want to update.
    //updateData: Partial<User> – This is the data you're updating the user with. It's of type Partial<User>, meaning all fields are optional.
    //Promise<User> – The function returns a promise that resolves to the updated User document.
   // this.userModel – Your injected Mongoose model for the User schema.
   //.findByIdAndUpdate(...) – A Mongoose method that:
    //new: true – Ensures the updated document is returned (instead of the old one).
    //runValidators: true – Forces Mongoose to apply schema validation to the update.
     async updateById(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  //// Delete a user by ID
  //this.userModel — The Mongoose model for the User schema.
  //findByIdAndDelete(id) — Mongoose method that:
  // Searches for a document by its _id, Deletes it if found,Returns the deleted document and Returns null if no document is found
  async deleteById(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id);
    
    // If no user was deleted, throw a 404 error
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }

  // Delete all users in the collection
  async deleteAll(): Promise<{ message: string }> {
    const result = await this.userModel.deleteMany({}); // Bulk delete

     // Return number of users deleted
    return { message: `${result.deletedCount} user(s) deleted successfully` };
  }
    

  // update password by email
async updatePassword(payload: { email: string; password: string }) {
  const { email, password } = payload;

  return this.userModel.findOneAndUpdate(
    { Email: email }, // Ensure your field name is correct, case-sensitive
    { Password: password }, // Match your DB field names (e.g., capital `Password`)
    { new: true }
  );
}


}
