import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLocationDto, FilterLocationType } from './dtos/CreateLocation.dto';
import { UpdateLocationDto } from './dtos/UpdateLocation.dto';
import { UpdateImageLocation } from './dtos/UpdateImageLocation.dto';
import { GoogleDriveService } from 'src/upload.service';

@Injectable()
export class LocationService {
    constructor(
      private prismaService:PrismaService,
      private readonly googleDriveService: GoogleDriveService
    ){}

    async getLocation(){
        return await this.prismaService.vitri.findMany({})
    }

    async getDetailLocation(id:number){
      return await this.prismaService.vitri.findUnique({
        where: { id: id }, // Sử dụng giá trị số
      })
    }

    async createLocation(createLocationDto: CreateLocationDto) {
        const drive = this.googleDriveService.getDrive();
        const checkLocation = await this.prismaService.vitri.findFirst({
          where: {
            tenViTri: createLocationDto.tenViTri,
          },
        });
      
        if (checkLocation) {
          if (createLocationDto && createLocationDto.hinhAnh) {
            const hinhAnh_id = createLocationDto?.hinhAnh.split('id=');
            if (hinhAnh_id.length >= 2) {

                try {
                  // Kiem tra fileId co ton tai khong
                  const fileMetadata = await drive.files?.get({ fileId:hinhAnh_id[1] });
                  if (fileMetadata) {
                  const data_avatar = await drive.files?.delete({ fileId: hinhAnh_id[1] });
                  // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
                  }
                } catch (error) {
                  if (error.code === 404) {
                    console.error('File not found.');
                  } else {
                    console.error('An error occurred:', error);
                  }
                  
                }
            }
          }
          throw new Error('Location with this name already exists.');
        }
      
        const newLocation = await this.prismaService.vitri.create({
          data: {
            ...createLocationDto
           
          },
        });
      
        return newLocation;
      }




      async pagination_search(filterLocationType: FilterLocationType) {
        const items_per_page = Number(filterLocationType.items_per_page) || 5;
        const page = Number(filterLocationType.page) || 1;
        const search = filterLocationType.search || '';
        const skip = page > 1 ? (page - 1) * items_per_page : 0;
      
        // Extract additional search parameters
        const { page: _, items_per_page: __, search: ___, ...searchParams } = filterLocationType;
      
        // Build the dynamic where clause
        const dynamicSearchParams = {
          AND: [
            {
              // Spread additional search parameters
              ...Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [
                  key,
                  { contains: value }, // Use contains dynamically for each searchParam without mode
                ])
              ),
            }
          ],
        };
      
        const users = await this.prismaService.vitri.findMany({
          take: items_per_page,
          skip,
          where: dynamicSearchParams,
        });
      
        const total = await this.prismaService.vitri.count({
          where: dynamicSearchParams,
        });
      
        return {
          pagination_search: users,
          total,
          currentPage: page,
          items_per_page: items_per_page,
        };
      }


      async updateLocationWithImage(id: number, updateLocationDto: UpdateLocationDto) {
        const drive = this.googleDriveService.getDrive();
        // Kiểm tra sự tồn tại của vi tri
        const checkLocation = await this.prismaService.vitri.findUnique({
          where: { id: id }, // Sử dụng giá trị số
        });
      
        if (!checkLocation) {
           this.deleteNoNeedImage(checkLocation,"hinhAnh");
            // if (checkLocation && checkLocation.hinhAnh) {
            //   const hinhAnh_id = checkLocation.hinhAnh.split('id=');
            //   if (hinhAnh_id.length >= 2) {

            //         try {
            //           const fileMetadata = await drive.files.get({ fileId:hinhAnh_id[1] });
            //           if (fileMetadata) {
            //           const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
            //           // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
            //           }
            //         } catch (error) {
            //           if (error.code === 404) {
            //             console.error('File not found.');
            //           } else {
            //             console.error('An error occurred:', error);
            //           }
                      
            //         }

            //   }
            // }
            throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }
      
        const updatedLocation = await this.prismaService.vitri.update({
          where: { id: id }, // Sử dụng giá trị số
          data: updateLocationDto,
        });

        if (updatedLocation) {
          if (checkLocation && checkLocation.hinhAnh) {
            const hinhAnh_id = checkLocation.hinhAnh.split('id=');
            if (hinhAnh_id.length >= 2) {

                  try {
                    const fileMetadata = await drive.files.get({ fileId:hinhAnh_id[1] });
                    if (fileMetadata) {
                    const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
                    // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
                    }
                  } catch (error) {
                    if (error.code === 404) {
                      console.error('File not found.');
                    } else {
                      console.error('An error occurred:', error);
                    }
                    
                  }

            }
          }
    
        }
      
        return updatedLocation;
      }



      async updateLocationWithoutImage(id: number, updateLocationDto: UpdateLocationDto) {
        
        // Kiểm tra sự tồn tại của người dùng
        const checkLocation = await this.prismaService.vitri.findUnique({
          where: { id: id }, // Sử dụng giá trị số
        });
      
        if (!checkLocation) {
          throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }
      
        const updatedLocation = await this.prismaService.vitri.update({
          where: { id: id }, // Sử dụng giá trị số
          data: updateLocationDto,
        });
      
        return updatedLocation;
      }





      async updateImageLocation(updateImageLocation: UpdateImageLocation) {
        const drive = this.googleDriveService.getDrive();
        // Chuyển đổi ID thành số nếu cần

        const {id,...updatedImageLocationDto}=updateImageLocation
        const locationId = Number(id);

        // Kiểm tra sự tồn tại của người dùng
        const checkLocation = await this.prismaService.vitri.findUnique({
          where: { id: locationId }, // Sử dụng giá trị số
        });
      
        if (!checkLocation) {
          //  xoa anh da them vao drive truoc do
              if (updatedImageLocationDto && updatedImageLocationDto.hinhAnh) {
                this.deleteNoNeedImage(updatedImageLocationDto,"hinhAnh");
              }
          throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }
      
      
        // Cập nhật thông tin người dùng
        const updatedLocation = await this.prismaService.vitri.update({
          where: { id: locationId }, // Sử dụng giá trị số
          data: updatedImageLocationDto,
        });

        if (checkLocation && checkLocation.hinhAnh) {
          this.deleteNoNeedImage(checkLocation,"hinhAnh");
        }
    
      
        return updatedLocation;
      }


      async deleteLocation(id: number){
        const drive = this.googleDriveService.getDrive();
        const checkLocation= await this.prismaService.vitri.findUnique({
             where:{
                id:id
             }
           });
         if(!checkLocation){
            // this.deleteNoNeedImage(checkLocation,"hinhAnh");
             throw new HttpException({message:"Location does not exist"}, HttpStatus.BAD_REQUEST)
         }
        
       const res = await this.prismaService.vitri.delete({
        where:{
            id:id
         }
       })

       if (checkLocation && checkLocation.hinhAnh) {
        this.deleteNoNeedImage(checkLocation,"hinhAnh");
       }
       return res
     }


     async deleteNoNeedImage(valueObject: any, attributeObject: string) {
      const drive = this.googleDriveService.getDrive();
      const hinhAnh_id = valueObject[attributeObject].split('id=');
      
      if (hinhAnh_id.length >= 2) {
        try {
          // Check if the file exists
          const fileMetadata = await drive.files.get({ fileId: hinhAnh_id[1] });
    
          if (fileMetadata) {
            // If the file exists, delete it
            await drive.files.delete({ fileId: hinhAnh_id[1] });
            console.log('File deleted successfully');
          }
        } catch (error) {
          if (error.code === 404) {
            console.error('File not found.');
          } else {
            console.error('An error occurred:', error);
          }
        }
      }
    
      // const hinhAnh_id = checkLocation.hinhAnh.split('id=');
        // if (hinhAnh_id.length >= 2) {

        //     try {
        //       const fileMetadata = await drive.files.get({ fileId:hinhAnh_id[1] });
        //       if (fileMetadata) {
        //       const data_avatar = await drive.files?.delete({ fileId: hinhAnh_id[1] });
        //       // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
        //       }
        //     } catch (error) {
        //       if (error.code === 404) {
        //         console.error('File not found.');
        //       } else {
        //         console.error('An error occurred:', error);
        //       }
              
        //     }
        // }


    }



    async writeSheet(createLocationDto: any) {
      try {
        const sheets = this.googleDriveService.getSheets();
        const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc';
    
        // Retrieve the spreadsheet metadata to get sheet names
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    
        // Log sheet names to ensure we are accessing the correct sheet
        console.log('Sheet names:', sheetNames);
    
        // Use the first sheet name
        const firstSheetName = sheetNames[0];
    
        // Define the range to write data to the first sheet
        const range = `${firstSheetName}!A1:E`; // Adjust the range as needed
    
        // Prepare data to write
        const written_Value = [
          createLocationDto.id,
          createLocationDto.tenViTri,
          createLocationDto.tinhThanh,
          createLocationDto.quocGia,
          createLocationDto.hinhAnh
        ];
    
        // Convert the single row of values into an array format
        const values = [written_Value];
    
        // Prepare the request
        const request = {
          spreadsheetId,
          range,
          valueInputOption: 'RAW',
          requestBody: {
            values
          },
        };
    
        // Append the values in the sheet
        const response = await sheets.spreadsheets.values.append(request);
        console.log('Sheet updated successfully:', response.data);
    
      } catch (error) {
        console.error('Error updating spreadsheet:', error);
        // Optionally, you can throw the error to be handled by a higher-level error handler
        throw new Error('Error updating spreadsheet: ' + error.message);
      }
    }
    
      
      
}
