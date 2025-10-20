import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse } from 'cloudinary';

@ApiTags('cloudinary')
@Controller('cloudinary')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class CloudinaryController {
  constructor(private readonly service: CloudinaryService) {}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Subir Imagen' })
    @ApiBody({
    description: `Debe subir el Archivo de Imagen`,
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
              maxSize: 10000000,
              message: 'El Archivo debe ser menor a 10Mb',
            }),
            new FileTypeValidator({
              fileType: /(.jpg|.jpeg|.png|.webp)$/,
            }),
          ],
        }),
      )
      file: Express.Multer.File,
    ): Promise<UploadApiResponse>  {
      console.log('File', file);
      return await this.service.uploadImage(file);
    }


}
