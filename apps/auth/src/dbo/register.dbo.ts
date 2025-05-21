// Importing specific validation decorators from the class-validator library
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'

// Defining a class (DTO - Data Transfer Object) used when a user registers
export class registerDbo{


    // Ensures the field has a value and is not empty.
    @IsNotEmpty()
    Name:string

   // Checks for a valid email format.
     @IsNotEmpty()
     @IsEmail()
    Email:string
     
    //Ensures that passwords have a minimum secure length
    @MinLength(6)
     @IsNotEmpty()
    Password:string
     
    // Validates that the value is a string. Useful especially when strict typing is needed for roles.
    @IsString()
    role:'customer' | 'admin'

}