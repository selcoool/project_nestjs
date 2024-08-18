import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  pass_word?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  birth_day?: string;

  @IsOptional()
  @IsString()
  gender?: string;


  @IsOptional()
  @IsString()
  role?: string;
}


export interface FilterUserType{
  items_per_page?:number
  page?:number
  search?:string
}