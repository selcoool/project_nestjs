import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto, FilterRoomLocationType, FilterRoomType } from './dtos/CreateRoom.dto';
import { UpdateRoomDto } from './dtos/UpdateRoom.dto';
import { UpdateImageRoomDto } from './dtos/UpdateImageRoom.dto';
import { GoogleDriveService } from 'src/upload.service';

@Injectable()
export class RoomService {
  constructor(
    private prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
    

  ) { }


  async getRoom() {
    return await this.prismaService.phong.findMany({})
  }


  async getDetailRoom(id: number) {
    return await this.prismaService.phong.findUnique({
      where: { id: id }, // Sử dụng giá trị số
    })
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const drive = this.googleDriveService.getDrive();
    // console.log('ddd', createRoomDto)
    const checkUser = await this.prismaService.nguoidung.findFirst({
      where: {
        id: Number(createRoomDto.khach),
      },
    });

    if (!checkUser) {
      this.deleteNoNeedImage(createRoomDto,"hinhAnh")
      // if (createRoomDto && createRoomDto.hinhAnh) {
      //   const hinhAnh_id = createRoomDto.hinhAnh.split('id=');
      //   if (hinhAnh_id.length >= 2) {

      //       try {
      //         const fileMetadata = await drive.files?.get({ fileId:hinhAnh_id[1] });
      //         if (fileMetadata) {
      //         const data_avatar = await drive.files?.delete({ fileId: hinhAnh_id[1] });
      //         // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      //         }
      //       } catch (error) {
      //         if (error.code === 404) {
      //           console.error('File not found.');
      //         } else {
      //           console.error('An error occurred:', error);
      //         }
              
      //       }
      //     // const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
      //     // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      //   }
      // }
      throw new Error('The user does not exist');
    }

    const checkLocation = await this.prismaService.vitri.findFirst({
      where: {
        id: Number(createRoomDto.maViTri),
      },
    });

    if (!checkLocation) {
      this.deleteNoNeedImage(createRoomDto,"hinhAnh")
      // if (createRoomDto && createRoomDto.hinhAnh) {
      //   const hinhAnh_id = createRoomDto.hinhAnh.split('id=');
      //   if (hinhAnh_id.length >= 2) {
      //         if (createRoomDto && createRoomDto.hinhAnh) {
      //           const hinhAnh_id = createRoomDto.hinhAnh.split('id=');
      //           if (hinhAnh_id.length >= 2) {
        
      //               try {
      //                 const fileMetadata = await drive.files?.get({ fileId:hinhAnh_id[1] });
      //                 if (fileMetadata) {
      //                 const data_avatar = await drive.files?.delete({ fileId: hinhAnh_id[1] });
      //                 // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      //                 }
      //               } catch (error) {
      //                 if (error.code === 404) {
      //                   console.error('File not found.');
      //                 } else {
      //                   console.error('An error occurred:', error);
      //                 }
                      
      //               }
      //             // const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
      //             // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      //           }
      //         }
        
      //   }
      // }
      throw new Error('The location does not exist');
    }




    const newRoom = await this.prismaService.phong.create({
      data: {
        ...createRoomDto

      },
    });

    return newRoom;
  }


  async search_room_location(filterRoomLocationType: FilterRoomLocationType) {
    const items_per_page = Number(filterRoomLocationType.items_per_page) || Number(process.env.ITEMS_PER_PAGE)
    const page = Number(filterRoomLocationType.page) || 1
    const search = filterRoomLocationType.search || ''
    const skip = page > 1 ? (page - 1) * items_per_page : 0
    const rooms = await this.prismaService.phong.findMany({
      take: items_per_page,
      skip,
      where: {
        AND: [
          {
            maViTri: {
              equals: Number(search) // Chuyển `search` thành số nếu nó là chuỗi
            }
          }
        ]

      }
    })

    const total = await this.prismaService.phong.count({
      where: {
        AND: [
          {
            maViTri: {
              equals: Number(search) // Chuyển `search` thành số nếu nó là chuỗi
            }
          }
        ]
      }
    });

    return {
      search_room_location: rooms,
      total,
      currentPage: page,
      items_per_page: items_per_page,
    };
  }


  async pagination_search(filterRoomType: FilterRoomType) {
    const items_per_page = Number(filterRoomType.items_per_page) || Number(process.env.ITEMS_PER_PAGE);
    const page = Number(filterRoomType.page) || 1;
    const search = filterRoomType.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    // Extract additional search parameters
    const { page: _, items_per_page: __, search: ___, ...searchParams } = filterRoomType;



    // Build the dynamic where clause
    const dynamicSearchParams = {
      AND: [
        {

          tenPhong: {
            contains: search
          }

        }
      ],
    };

    const users = await this.prismaService.phong.findMany({
      take: items_per_page,
      skip,
      where: dynamicSearchParams,
    });

    const total = await this.prismaService.phong.count({
      where: dynamicSearchParams,
    });

    return {
      pagination_search: users,
      total,
      currentPage: page,
      items_per_page: items_per_page,
    };
  }


  async deleteRoom(id: number) {

    const drive = this.googleDriveService.getDrive();
    const checkRoom = await this.prismaService.phong.findUnique({
      where: {
        id: id
      }
    });
    if (!checkRoom) {
      throw new HttpException({ message: "Room does not exist" }, HttpStatus.BAD_REQUEST)
    }


    const res = await this.prismaService.phong.delete({
      where: {
        id: id
      }
    })

    // if (checkRoom && checkRoom.hinhAnh) {
    //   const hinhAnh_id = checkRoom.hinhAnh.split('id=');
    //   if (hinhAnh_id.length >= 2) {
    //     const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
    //     // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
    //   }

    // }

    if (checkRoom && checkRoom.hinhAnh) {
      this.deleteNoNeedImage(checkRoom,"hinhAnh")
      // const hinhAnh_id = checkRoom.hinhAnh.split('id=');
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




    return res
  }

  async updateRoomWithImage(id: number, updateRoomDto: UpdateRoomDto) {
    const drive = this.googleDriveService.getDrive();
    // Chuyển đổi ID thành số nếu cần
    const roomId = Number(id);

    // Kiểm tra sự tồn tại của người dùng
    const checkRoom = await this.prismaService.phong.findUnique({
      where: { id: roomId }, // Sử dụng giá trị số
    });

    if (!checkRoom) {
      this.deleteNoNeedImage(checkRoom,"hinhAnh")
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    // Cập nhật thông tin người dùng
    const updatedRoom = await this.prismaService.phong.update({
      where: { id: roomId },
      data: updateRoomDto,
    });

    if (updatedRoom) {
      this.deleteNoNeedImage(checkRoom,"hinhAnh")
      // if (checkRoom && checkRoom.hinhAnh) {
      //   const hinhAnh_id = checkRoom.hinhAnh.split('id=');
      //   if (hinhAnh_id.length >= 2) {
      //     const data_avatar = await drive.files.delete({ fileId: hinhAnh_id[1] });
      //     // const data_avatar = await drive.files.delete({ fileId: anh_dai_dien_id.pop() });
      //   }
      // }

    }

    return updatedRoom;
  }


  async updateRoomWithoutImage(id: number, updateRoomDto: UpdateRoomDto) {
    // const drive = this.googleDriveService.getDrive();
    // Chuyển đổi ID thành số nếu cần
    const roomId = Number(id);

    // Kiểm tra sự tồn tại của người dùng
    const checkRoom = await this.prismaService.phong.findUnique({
      where: { id: roomId }, // Sử dụng giá trị số
    });

    if (!checkRoom) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
    // const { id: _, ...updateData } = updateUserDto;

    // Cập nhật thông tin người dùng
    const updatedRoom = await this.prismaService.phong.update({
      where: { id: roomId },
      data: updateRoomDto,
    });



    return updatedRoom;
  }






  async updateImageRoom(updateImageRoom: UpdateImageRoomDto) {
    const drive = this.googleDriveService.getDrive();
    // Chuyển đổi ID thành số nếu cần

    const { id, ...updatedImageRoomDto } = updateImageRoom
    const roomId = Number(id);

    // Kiểm tra sự tồn tại của người dùng
    const checkRoom = await this.prismaService.phong.findUnique({
      where: { id: roomId }, // Sử dụng giá trị số
    });

    if (!checkRoom) {
      this.deleteNoNeedImage(checkRoom,"hinhAnh")
   
   
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    // Loại bỏ id khỏi updateUserDto để tránh cập nhật không mong muốn
    // const { id: _, ...updateData } = updateUserDto;

    // Cập nhật thông tin người dùng
    const updatedRoom = await this.prismaService.phong.update({
      where: { id: roomId }, // Sử dụng giá trị số
      data: updatedImageRoomDto,
    });


    if (checkRoom && checkRoom.hinhAnh) {
       this.deleteNoNeedImage(checkRoom,"hinhAnh");

    }




    return updatedRoom;
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
  }



  async writeSheet(createRoomDto: any) {
    try {
      const sheets = this.googleDriveService.getSheets();
      const spreadsheetId = '10mYzjqgnED6jFyTgsMqKB0vu1sdFLOXsONmG-vqwyAc';
  
      // Retrieve the spreadsheet metadata to get sheet names
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetNames = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
  
      // Log sheet names to ensure we are accessing the correct sheet
      console.log('Sheet names:', sheetNames);
  
      // Use the first sheet name
      const firstSheetName = sheetNames[1];
  
      // Define the range to write data to the first sheet
      const range = `${firstSheetName}!A1:R`; // Adjust the range as needed
  
      // Prepare data to write
      const written_Value = [ 
        createRoomDto.id,
        createRoomDto.tenPhong,
        createRoomDto.khach,
        createRoomDto.phongNgu,
        createRoomDto.giuong,
        createRoomDto.phongTam,
         createRoomDto.moTa,
        createRoomDto.giaTien,
         createRoomDto.mayGiat,
        createRoomDto.banLa,
        createRoomDto.tivi, 
        createRoomDto.dieuHoa,
        createRoomDto.wifi,
        createRoomDto.bep,
         createRoomDto.doXe,
        createRoomDto.hoBoi,
        createRoomDto.banUi,
        createRoomDto.maViTri


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
