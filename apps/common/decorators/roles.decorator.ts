import { SetMetadata } from "@nestjs/common";

export  const ROLES_KEY = 'roles'
export const Roles = (...roles:string[])=>  SetMetadata(ROLES_KEY,roles) 
// this allows user to use @Roles('admin') or @Roles('admin','customer')
