import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class SignUpDto {


  @IsString()
  name?: string;


  @IsEmail()
  email?: string;


  @IsString()
  pass_word?: string;


  @IsString()
  phone?: string;


  @IsString()
  birth_day?: string;


  @IsString()
  gender?: string;

  @IsString()
  role?: string;
}