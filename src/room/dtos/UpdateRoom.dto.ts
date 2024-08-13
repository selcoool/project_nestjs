import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateRoomDto {
    @IsOptional()
    @IsString()
    tenPhong?:string
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    khach?:number

    @IsOptional()
    @IsNumber()  
    @Type(() => Number)
    phongNgu?:number
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    giuong?:number


    @IsOptional()
    @IsNumber()  
    @Type(() => Number) 
    phongTam?:number  
   
    @IsOptional()
    @IsString()
    moTa?: string
    
    @IsOptional()
    @IsNumber()  
    @Type(() => Number) 
    giaTien?: number
    
    @IsOptional()
    @Type(() => Boolean)
    mayGiat?: boolean

    @IsOptional()
    @Type(() => Boolean)
    banLa?:boolean

    @IsOptional()
    @Type(() => Boolean)   
    tivi?:boolean   

    @IsOptional()
    @Type(() => Boolean)
    dieuHoa?:boolean 

    @IsOptional()
    @Type(() => Boolean)
    wifi?:boolean 

    @IsOptional()
    @Type(() => Boolean)
    bep?:boolean 
    
    @IsOptional()
    @Type(() => Boolean)
    doXe?:boolean  
    
    @IsOptional()
    @Type(() => Boolean)
    hoBoi?:boolean  
    
    @IsOptional()
    @Type(() => Boolean)
    banUi?:boolean


    @IsOptional()  
    @Type(() => Number)
    maViTri?: number

    @IsOptional()
    @IsString()
    hinhAnh?: string
}