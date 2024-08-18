import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  
  @IsOptional()
  @IsString()
  tenPhong: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  khach: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  phongNgu: number;
  
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  giuong: number;

  @IsOptional()
  @IsNumber()  
  @Type(() => Number) 
  phongTam: number;  
 
  @IsOptional()
  @IsString()
  moTa: string;

  @IsOptional()
  @IsNumber()  
  @Type(() => Number) 
  giaTien: number;
  
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  mayGiat: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  banLa: boolean;

  @IsOptional()
  @IsBoolean()   
  @Type(() => Boolean)
  tivi: boolean;   

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  dieuHoa: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  wifi: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  bep: boolean;
  
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  doXe: boolean;  
  
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hoBoi: boolean;  
  
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  banUi: boolean;

  @IsOptional()  
  @IsNumber() 
  @Type(() => Number)
  maViTri: number;
  
  @IsOptional()
  @IsString()
  hinhAnh?: string;
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