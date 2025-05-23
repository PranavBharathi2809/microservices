import { IsString } from "class-validator";
export class CategoryDto{
    @IsString()
    cat:string;
    @IsString()
    desc:string
}