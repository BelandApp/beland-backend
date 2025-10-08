import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventPassRepository } from './event-pass.repository';
import { EventPass } from './entities/event-pass.entity';
import { EventPassFiltersDto } from './dto/event-pass-filter.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

@Injectable()
export class EventPassService {
  private readonly completeMessage = 'la Entrada al Evento';

  constructor(private readonly repository: EventPassRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    pageNumber: number,
    limitNumber: number,
    filters?: EventPassFiltersDto,
  ): Promise<[EventPass[], number]> {
    try {
      const response = await this.repository.findAll(
        pageNumber,
        limitNumber,
        filters
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<EventPass> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<EventPass>): Promise<EventPass> {
    try {
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateImage(id: string, file: Express.Multer.File): Promise<EventPass> {
    try {
      if (!file) {
        throw new BadRequestException('No se recibió ninguna imagen');
      }

      const eventPass = await this.repository.findOne(id);
      if (!eventPass) {
        throw new NotFoundException('La entrada que desea actualizar no existe');
      }

      const imgUpload = await this.cloudinaryService.uploadImage(file);
      if (!imgUpload || !imgUpload.secure_url) {
        throw new InternalServerErrorException('Error al subir la imagen a Cloudinary');
      }

      eventPass.image_url = imgUpload.secure_url;

      const updatedUser = await this.repository.create(eventPass);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error al subir imagen de la entrada:', error);

      // Si es un error HTTP lanzado por Nest, lo volvemos a lanzar tal cual
      if (error instanceof HttpException) throw error;

      // Si no, lanzamos un error genérico
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar la imagen de la entrada',
      );
    }
  }

  async update(id: string, body: Partial<EventPass>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
