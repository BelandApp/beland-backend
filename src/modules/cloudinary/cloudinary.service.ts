import { Injectable, BadRequestException, Inject, Logger } from "@nestjs/common";
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
  private readonly logger = new Logger(CloudinaryService.name);

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

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      const publicId = this.extractPublicId(imageUrl);

      if (!publicId) {
        this.logger.warn(`No se pudo extraer public_id de la URL: ${imageUrl}`);
        return;
      }

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok' && result.result !== 'not found') {
        this.logger.warn(
          `Cloudinary delete inesperado. publicId=${publicId}, result=${result.result}`,
        );
      }

    } catch (error) {
      this.logger.error(
        `Error al eliminar imagen de Cloudinary (${imageUrl})`,
        error,
      );
      // ⚠️ NO lanzamos excepción
      // borrar imagen nunca debería romper el flujo principal
    }
  }

  private extractPublicId(imageUrl: string): string | null {
    try {
      const url = new URL(imageUrl);

      // pathname: /myapp/image/upload/v1700000000/groups/cover_abc123.webp
      const parts = url.pathname.split('/');

      // Buscamos "upload"
      const uploadIndex = parts.findIndex(p => p === 'upload');
      if (uploadIndex === -1) return null;

      // Todo lo que viene después de version
      const publicIdWithExtension = parts
        .slice(uploadIndex + 2)
        .join('/');

      // Quitamos extensión (.jpg, .png, .webp, etc)
      return publicIdWithExtension.replace(/\.[^/.]+$/, '');

    } catch {
      return null;
    }
  }
}
