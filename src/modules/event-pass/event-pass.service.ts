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
  ): Promise<[EventPass[], number]> {
    this.logger.log(`🔍 Buscando entradas (página ${pageNumber}, límite ${limitNumber})`);
    try {
      const response = await this.repository.findAll(pageNumber, limitNumber, filters);
      this.logger.log(`✅ ${response[0].length} entradas obtenidas correctamente`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error al obtener entradas: ${error}`);
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

  async create(body: Partial<EventPass>): Promise<EventPass> {
    this.logger.log(`🆕 Creando nueva entrada: ${body.name}`);
    try {
      const eventPass = await this.repository.create(body);

      this.logger.log(`🔗 Generando código QR para entrada ID: ${eventPass.id}`);
      eventPass.qr = await QRCode.toDataURL(eventPass.id);

      const res = await this.repository.create(eventPass);
      if (!res) {
        this.logger.error(`❌ No se pudo crear ${this.completeMessage}`);
        throw new InternalServerErrorException(`No se pudo crear ${this.completeMessage}`);
      }

      this.logger.log(`✅ Entrada creada correctamente con ID: ${res.id}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al crear entrada: ${error}`);
      throw new InternalServerErrorException(error);
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
