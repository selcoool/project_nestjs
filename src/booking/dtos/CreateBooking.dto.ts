import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean,IsDateString } from 'class-validator';

export class CreateBookingDto {
   
    @IsNumber()
    @Type(() => Number)
    maPhong:number
    
    @IsDateString()
    ngayDen:string
    
    @IsDateString()
    ngayDi:string  
    
    @IsNumber()
    @Type(() => Number)
    soLuongKhach:number
  
    @IsNumber()
    @Type(() => Number)
    maNguoiDung: number  // phải có thuộc tính này và kiểm này, không có không được
   

}