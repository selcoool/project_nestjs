import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean,IsDateString } from 'class-validator';

export class UpdateBookingDto {
   
    @IsNumber()
    @Type(() => Number)
    maPhong?:number
    
    @IsDateString()
    ngayDen?:string
    
    @IsDateString()
    ngayDi?:string  
    
    @IsNumber()
    @Type(() => Number)
    soLuongKhach?:number
  
    @IsNumber()
    @Type(() => Number)
    maNguoiDung?: number  //có hay không có cũng được
   

}