import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateCommentDto {
    
    @IsOptional()
    @IsNumber()
    maPhong?:number
    

    @IsOptional()
    @IsNumber()
    maNguoiBinhLuan?:number
    
    @IsOptional()
    @IsString()
    ngayBinhLuan?:string


    @IsOptional()
    @IsString()
    noiDung?:string


    @IsOptional()
    @IsNumber()
    saoBinhLuan?:number
}