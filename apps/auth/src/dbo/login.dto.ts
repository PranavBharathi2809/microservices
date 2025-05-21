
// Importing validation decorators from class-validator library
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'


// Defining the Data Transfer Object (DTO) for login functionality
export class loginDto{
 
    // Ensures the Email field is not empty
    // Also validates that the value is a properly formatted email address
     @IsNotEmpty()
     @IsEmail()
    Email:string
     

    // Ensures the Password field has a minimum length of 6 characters
    // Ensures the Password field is not empty
    @MinLength(6)
     @IsNotEmpty()
    Password:string
    

}