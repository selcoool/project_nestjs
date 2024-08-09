import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class SignInDto {

  @IsEmail()
  email?: string;

  @IsString()
  pass_word?: string;

}