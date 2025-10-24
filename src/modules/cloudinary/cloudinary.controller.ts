import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse } from 'cloudinary';

@ApiTags('cloudinary')
@Controller('cloudinary')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class CloudinaryController {
  constructor(private readonly service: CloudinaryService) {}

  // ===============================
  // 🖼️ SUBIR UNA SOLA IMAGEN
  // ===============================
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir una sola imagen' })
  @ApiBody({
    description: 'Debe subir un archivo de imagen (jpg, jpeg, png o webp)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10_000_000,
            message: 'El archivo debe ser menor a 10Mb',
          }),
          new FileTypeValidator({
            fileType: /(.jpg|.jpeg|.png|.webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<string> {
    console.log('File recibido:', file.originalname);
    const result = await this.service.uploadImage(file);
    return result as string;
  }

  // ===============================
  // 🖼️ SUBIR VARIAS IMÁGENES
  // ===============================
  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir múltiples imágenes' })
  @ApiBody({
    description: 'Debe subir uno o varios archivos de imagen (jpg, jpeg, png o webp)',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imágenes subidas exitosamente' })
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10_000_000,
            message: 'Cada archivo debe ser menor a 10Mb',
          }),
          new FileTypeValidator({
            fileType: /(.jpg|.jpeg|.png|.webp)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<string[]> {
    console.log(`Cantidad de archivos recibidos: ${files.length}`);
    const urls = await this.service.uploadImage(files);
    return urls as string[];
  }
}
