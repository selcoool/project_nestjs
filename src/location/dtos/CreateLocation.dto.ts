import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateLocationDto {
    @IsString()
    tenViTri: string
    @IsString()
    tinhThanh: string
    @IsString()
    quocGia: string
    @IsString()
    hinhAnh: string
}


export interface FilterLocationType{
    items_per_page?:number
    page?:number
    search?:string
  }