import { IsOptional, IsString, IsInt } from 'class-validator';
// import { Type } from 'class-transformer';

export class UpdateImageLocation {

    @IsOptional()
    @IsString()
    id?: string

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