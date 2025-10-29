import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { ConfigService } from "@nestjs/config";
const toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    // Configuramos Cloudinary usando las variables de entorno de NestJS
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File | Express.Multer.File[],
  ): Promise<string | string[]> {
    if (!file) {
      throw new BadRequestException("No se proporcionó ningún archivo");
    }

    // 📁 Caso: un solo archivo
    if (!Array.isArray(file)) {
      const image = await this.uploadSingle(file);
      return image.secure_url;
    }

    // 📁 Caso: varios archivos
    const results = await Promise.all(
      file.map(async (f) => {
        const res = await this.uploadSingle(f);
        return res.secure_url; // o res.url si querés
      }),
    );

    return results;
  }

  private async uploadSingle(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
