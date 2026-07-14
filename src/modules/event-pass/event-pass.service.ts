import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventPassRepository } from './event-pass.repository';
import { EventPass } from './entities/event-pass.entity';
import * as QRCode from 'qrcode';
import { EventPassFiltersDto } from './dto/event-pass-filter.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { CreateEventPassDto } from './dto/create-event-pass.dto';
import { EventPassType } from './entities/event-pass-type.entity';

@Injectable()
export class EventPassService {
  private readonly completeMessage = 'la Entrada al Evento';
  private readonly logger = new Logger(EventPassService.name); // 👈 Logger oficial de Nest

  constructor(
    private readonly repository: EventPassRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    pageNumber: number,
    limitNumber: number,
    filters?: EventPassFiltersDto,
  ): Promise<RespGetArrayDto<EventPass>> {
    this.logger.log(`🔍 Buscando entradas (página ${pageNumber}, límite ${limitNumber})`);
    try {
      const response = await this.repository.findAll(pageNumber, limitNumber, filters);
      this.logger.log(`✅ ${response.data.length} entradas obtenidas correctamente`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error al obtener entradas: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllTypes(
    pageNumber: number,
    limitNumber: number,
  ): Promise<RespGetArrayDto<EventPassType>> {
    this.logger.log(`🔍 Buscando tipos de entradas (página ${pageNumber}, límite ${limitNumber})`);
    try {
      const response = await this.repository.findAllTypes(pageNumber, limitNumber);
      this.logger.log(`✅ ${response.data.length} tipos de entradas obtenidas correctamente`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error al obtener los tipos de entradas: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<EventPass> {
    this.logger.log(`🔎 Buscando entrada con ID: ${id}`);
    try {
      const res = await this.repository.findOne(id);
      if (!res) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Entrada encontrada: ${res.name}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al buscar entrada: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async create(
    dto: CreateEventPassDto,
    files: {
      image_url?: Express.Multer.File[];
      images_urls?: Express.Multer.File[];
    },
    user_id: string,
  ): Promise<EventPass> {
    this.logger.log(`Iniciando creación de EventPass para el evento: ${dto.name}`);

    try {
      // --- 1️⃣ Validaciones seguras ---
      if (!files?.image_url || files.image_url.length === 0) {
        throw new BadRequestException('Debe subir al menos una imagen principal');
      }

      const mainImageFile = files.image_url[0];
      const additionalFiles: Express.Multer.File[] = files?.images_urls ?? [];

      this.logger.debug(
        `Archivos recibidos: principal (${mainImageFile?.originalname}), adicionales: ${additionalFiles.length}`,
      );

      // --- 2️⃣ Subir imágenes a Cloudinary ---
      this.logger.log('Subiendo imágenes a Cloudinary...');

      const mainImage = (await this.cloudinaryService.uploadImage(
        mainImageFile,
      )) as string;

      const additionalImages: string[] =
        additionalFiles.length > 0
          ? ((await this.cloudinaryService.uploadImage(
              additionalFiles,
            )) as string[])
          : [];

      // --- 3️⃣ Calcular precio con descuento ---
      const discount = Number(dto.discount ?? 0);
      const price = Number(dto.price_usd);

      const totalPrice = price - (price * discount) / 100;

      this.logger.debug(
        `Precio base: ${price}, descuento: ${discount}%, total final: ${totalPrice}`,
      );

      // --- 4️⃣ Crear entidad ---
      const eventPass = await this.repository.create({
        ...dto,
        image_url: mainImage,
        images_urls: additionalImages,
        total_usd: totalPrice,
        created_by_id: user_id,
      });

      // --- 5️⃣ Generar QR ---
      const qr = await QRCode.toDataURL(eventPass.id);
      eventPass.qr = qr;

      // --- 6️⃣ Guardar en DB ---
      const savedEventPass = await this.repository.create(eventPass);

      this.logger.log(`EventPass creado con éxito: ID ${savedEventPass.id}`);

      return savedEventPass;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));

      this.logger.error('Error al crear EventPass', err.stack);

      throw new InternalServerErrorException(
        'Error al crear el evento: ' + err.message,
      );
    }
  }

  async updateImage(id: string, file: Express.Multer.File): Promise<EventPass> {
    this.logger.log(`🖼️ Actualizando imagen de entrada con ID: ${id}`);
    try {
      if (!file) {
        this.logger.warn(`⚠️ No se recibió ninguna imagen para la entrada con ID: ${id}`);
        throw new BadRequestException('No se recibió ninguna imagen');
      }

      const eventPass = await this.repository.findOne(id);
      if (!eventPass) {
        this.logger.warn(`⚠️ No se encontró la entrada con ID: ${id}`);
        throw new NotFoundException('La entrada que desea actualizar no existe');
      }

      const imgUpload_url = await this.cloudinaryService.uploadImage(file) as string;
      if (!imgUpload_url) {
        this.logger.error('❌ Error al subir la imagen a Cloudinary');
        throw new InternalServerErrorException('Error al subir la imagen a Cloudinary');
      }

      eventPass.image_url = imgUpload_url;
      const updatedEvent = await this.repository.create(eventPass);

      this.logger.log(`✅ Imagen actualizada correctamente para entrada ID: ${id}`);
      return updatedEvent;
    } catch (error) {
      console.error('Error al subir a Cloudinary:', error); // 🔹 así vemos todo
      throw new InternalServerErrorException('Error al actualizar la imagen del evento: ' + JSON.stringify(error));
    }
  }

  async update(id: string, body: Partial<EventPass>) {
    this.logger.log(`✏️ Actualizando entrada con ID: ${id}`);
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Entrada actualizada correctamente: ${id}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al actualizar entrada: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    this.logger.log(`🗑️ Eliminando entrada con ID: ${id}`);
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Entrada eliminada correctamente: ${id}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al eliminar entrada: ${error}`);
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
