import { IsOptional, IsString, IsInt } from 'class-validator';
// import { Type } from 'class-transformer';

export class UpdateLocationDto {

    @IsOptional()
    @IsString()
    tenViTri?: string

    @IsOptional()
    @IsString()
    tinhThanh?: string

    @IsOptional()
    @IsString()
    quocGia?: string

    @IsOptional()
    @IsString()
    hinhAnh?: string

}