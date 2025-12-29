import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ServiceRepository } from './services.repository';
import { Service } from './entities/service.entity';
import { ServiceFiltersDto } from './dto/service-filters.dto';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  private readonly completeMessage = 'el Servicio';
  private readonly logger = new Logger(ServiceService.name);

  constructor(
    private readonly repository: ServiceRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ============================
  // FIND ALL
  // ============================
  async findAll(
    pageNumber: number,
    limitNumber: number,
    filters?: ServiceFiltersDto,
  ): Promise<RespGetArrayDto<Service>> {
    this.logger.log(`🔍 Buscando servicios (página ${pageNumber}, límite ${limitNumber})`);
    try {
      const response = await this.repository.findAll(
        pageNumber,
        limitNumber,
        filters,
      );
      this.logger.log(`✅ ${response.data.length} servicios obtenidos correctamente`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error al obtener servicios: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  // ============================
  // FIND ONE
  // ============================
  async findOne(id: string): Promise<Service> {
    this.logger.log(`🔎 Buscando servicio con ID: ${id}`);
    try {
      const res = await this.repository.findOne(id);
      if (!res) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Servicio encontrado: ${res.name}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al buscar servicio: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  // ============================
  // CREATE
  // ============================
  async create(
    dto: CreateServiceDto,
    file: Express.Multer.File,
    user_id: string,
  ): Promise<Service> {
    this.logger.log(`🛠️ Iniciando creación de servicio: ${dto.name}`);

    try {
      // --- 1️⃣ Validaciones previas ---
      if (!file) {
        throw new BadRequestException('Debe subir una imagen del servicio');
      }

      // --- 2️⃣ Subir imagen a Cloudinary ---
      this.logger.log('📤 Subiendo imagen del servicio a Cloudinary...');
      const imageUrl = await this.cloudinaryService.uploadImage(file) as string;

      if (!imageUrl) {
        throw new InternalServerErrorException(
          'Error al subir la imagen a Cloudinary',
        );
      }

      // --- 3️⃣ Crear entidad ---
      const service = await this.repository.create({
        ...dto,
        image_url: imageUrl,
        // created_by_id: user_id, // si lo agregás luego
      });

      this.logger.log(`✅ Servicio creado con éxito: ID ${service.id}`);
      return service;
    } catch (error) {
      this.logger.error('❌ Error al crear el servicio', error);
      throw new InternalServerErrorException(
        'Error al crear el servicio: ' + JSON.stringify(error),
      );
    }
  }

  // ============================
  // UPDATE IMAGE
  // ============================
  async updateImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<Service> {
    this.logger.log(`🖼️ Actualizando imagen del servicio con ID: ${id}`);

    try {
      if (!file) {
        this.logger.warn(`⚠️ No se recibió ninguna imagen para el servicio ${id}`);
        throw new BadRequestException('No se recibió ninguna imagen');
      }

      const service = await this.repository.findOne(id);
      if (!service) {
        this.logger.warn(`⚠️ Servicio no encontrado con ID: ${id}`);
        throw new NotFoundException('El servicio no existe');
      }

      const imageUrl = await this.cloudinaryService.uploadImage(file) as string;
      if (!imageUrl) {
        throw new InternalServerErrorException(
          'Error al subir la imagen a Cloudinary',
        );
      }

      service.image_url = imageUrl;
      const updatedService = await this.repository.create(service);

      this.logger.log(`✅ Imagen actualizada correctamente para servicio ID: ${id}`);
      return updatedService;
    } catch (error) {
      this.logger.error('❌ Error al actualizar imagen del servicio', error);
      throw new InternalServerErrorException(
        'Error al actualizar la imagen del servicio: ' +
          JSON.stringify(error),
      );
    }
  }

  // ============================
  // UPDATE
  // ============================
  async update(id: string, body: Partial<Service>) {
    this.logger.log(`✏️ Actualizando servicio con ID: ${id}`);
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Servicio actualizado correctamente: ${id}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al actualizar servicio: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  // ============================
  // REMOVE
  // ============================
  async remove(id: string) {
    this.logger.log(`🗑️ Eliminando servicio con ID: ${id}`);
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0) {
        this.logger.warn(`⚠️ No se encontró ${this.completeMessage} con ID: ${id}`);
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }
      this.logger.log(`✅ Servicio eliminado correctamente: ${id}`);
      return res;
    } catch (error) {
      this.logger.error(`❌ Error al eliminar servicio: ${error}`);
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
