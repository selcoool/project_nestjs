import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateCommentDto {

    @IsNumber()
    @Type(() => Number)
    maPhong:number
    
    @IsNumber()
    @Type(() => Number)
    maNguoiBinhLuan:number

    @IsString()
    ngayBinhLuan:string

    @IsString()
    noiDung:string

    @IsNumber()
    @Type(() => Number)
    saoBinhLuan:number
}