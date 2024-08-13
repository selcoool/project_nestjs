// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class SignInDto {

  // @ApiProperty({
  //   description: 'The ID of the location to update',
  //   example: '123456',
  // })

  @IsEmail()
  email?: string;

  @IsString()
  pass_word?: string;

}