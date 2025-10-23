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
import { UploadApiResponse } from 'cloudinary';
import { RespGetArrayDto } from 'src/dto/resp-get-Array.dto';
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
      this.logger.log(`✅ ${response[0].length} tipos de entradas obtenidas correctamente`);
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
    files: Express.Multer.File[],
    user_id: string,
  ): Promise<EventPass> {
    this.logger.log(`Iniciando creación de EventPass para el evento: ${dto.name}`);

    try {
      // --- 1️⃣ Validaciones previas ---
      if (!files || files.length === 0) {
        throw new BadRequestException('Debe subir al menos una imagen principal');
      }

      // --- 2️⃣ Separar la imagen principal de las adicionales ---
      const mainImageFile = files[0];
      const additionalFiles = files.slice(1);
      this.logger.debug(`Archivos recibidos: principal (${mainImageFile?.originalname}), adicionales: ${additionalFiles.length}`);

      // --- 3️⃣ Subir imágenes a Cloudinary ---
      this.logger.log('Subiendo imágenes a Cloudinary...');
      const mainImage = await this.cloudinaryService.uploadImage(mainImageFile) as string;
      const additionalImages = additionalFiles.length > 0 ? await this.cloudinaryService.uploadImage(additionalFiles) as string[] : [] as string[];

      // --- 4️⃣ Calcular el precio total con descuento ---
      const discount = Number(dto.discount ?? 0);
      const totalPrice = +dto.price_becoin - (+dto.price_becoin * discount) / 100;

      this.logger.debug(`Precio base: ${dto.price_becoin}, descuento: ${discount}%, total final: ${totalPrice}`);

      // --- 5️⃣ Crear la entidad EventPass ---
      const eventPass = await this.repository.create({
        ...dto,
        image_url: mainImage,
        images_urls: additionalImages,
        total_becoin: totalPrice,
        created_by_id: user_id, // o user.id según tu entidad
      });

      const qr = await QRCode.toDataURL(eventPass.id);
      const saveEventPass = await this.repository.create({...eventPass, qr});

      this.logger.log(`EventPass creado con éxito: ID ${eventPass.id}`);
      return eventPass;
    } catch (error) {
      this.logger.error(`Error al crear EventPass: ${error}`);
      throw new InternalServerErrorException('Error al crear el evento');
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
      this.logger.error(`❌ Error al actualizar imagen: ${error}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar la imagen de la entrada',
      );
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
