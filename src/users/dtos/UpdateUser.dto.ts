import { IsOptional, IsString, IsInt } from 'class-validator';
// import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
//   @Type(() => Number) // Đảm bảo chuyển đổi thành số nếu ID có trong body
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
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
