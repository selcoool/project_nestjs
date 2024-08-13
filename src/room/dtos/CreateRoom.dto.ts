import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    tenPhong:string

    @IsNumber()
    @Type(() => Number)
    khach:number

    @IsNumber()  
    @Type(() => Number)
    phongNgu:number
    
    @IsNumber()
    @Type(() => Number)
    giuong:number

    @IsNumber()  
    @Type(() => Number) 
    phongTam:number  
   
    @IsString()
    moTa: string

    @IsNumber()  
    @Type(() => Number) 
    giaTien: number
    
    @IsOptional()
    @Type(() => Boolean)
    mayGiat: boolean

    @IsOptional()
    @Type(() => Boolean)
    banLa:boolean

    @IsOptional()
    @Type(() => Boolean)   
    tivi:boolean   

    @IsOptional()
    @Type(() => Boolean)
    dieuHoa:boolean 

    @IsOptional()
    @Type(() => Boolean)
    wifi:boolean 

    @IsOptional()
    @Type(() => Boolean)
    bep:boolean 
    
    @IsOptional()
    @Type(() => Boolean)
    doXe:boolean  
    
    @IsOptional()
    @Type(() => Boolean)
    hoBoi:boolean  
    
    @IsOptional()
    @Type(() => Boolean)
    banUi:boolean


    @IsOptional()  
    @Type(() => Number)
    maViTri: number

    @IsString()
    hinhAnh: string
}


export interface FilterRoomLocationType{
    items_per_page?:number
    page?:number
    search?:string
  }

  export interface FilterRoomType{
    items_per_page?:number
    page?:number
    search?:string
  }