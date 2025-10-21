import { Injectable, BadRequestException } from "@nestjs/common";
import { UploadApiResponse, v2 } from "cloudinary";
const toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService {
  
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
        return res.secure_url; // o res.url, según necesites
      }),
    );

    return results;
  }

  private async uploadSingle(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: "auto" }, // 👈 corregido: era "resourse_type"
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
