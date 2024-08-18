import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';



export class UpdateCommentDto {
    
    @IsOptional()
    // @IsNumber()
    @Type(() => Number)
    maPhong?:number
    

    @IsOptional()
    // @IsNumber()
    @Type(() => Number)
    maNguoiBinhLuan?:number
    
    @IsOptional()
    @IsString()
    ngayBinhLuan?:string


    @IsOptional()
    @IsString()
    noiDung?:string


    @IsOptional()
    // @IsNumber()
    @Type(() => Number)
    saoBinhLuan?:number
}