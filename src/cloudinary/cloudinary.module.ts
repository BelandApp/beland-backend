import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  // Declaramos CloudinaryService como un proveedor dentro de este módulo
  providers: [CloudinaryService],

  // Exportamos CloudinaryService para que los módulos que importen CloudinaryModule puedan usarlo
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
