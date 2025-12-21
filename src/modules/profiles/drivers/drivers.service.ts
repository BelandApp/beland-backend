import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Driver } from './entities/driver.entity';
import { DriversRepository } from './drivers.repository';
import { DriverQueryDto } from './dto/driver-query.dto';
import { RespGetArrayDto, RespGetTypeDto } from 'src/dto/resp-app.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class DriversService {
    private readonly completeMessage = 'el Conductor';

    constructor(private readonly repository: DriversRepository) { }

    async findAll(query: DriverQueryDto): Promise<RespGetArrayDto<Driver>> {
    try {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 10;

        return await this.repository.findAll(query, page, limit);
    } catch (error) {
        throw new InternalServerErrorException(error);
    }
    }

    async findAllVehicleType(): Promise<RespGetTypeDto<Vehicle>> {
    try {
        return await this.repository.findAllVehicleType();
    } catch (error) {
        throw new InternalServerErrorException(error);
    }
    }

    async findOne(id: string): Promise<Driver> {
        try {
            const res = await this.repository.findOne(id);
            if (!res)
                throw new NotFoundException(`No se encontro ${this.completeMessage}`);
            return res;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByUser(user_id: string): Promise<Driver> {
        try {
            const res = await this.repository.findByUser(user_id);
            if (!res)
                throw new NotFoundException(`No se encontro ${this.completeMessage}`);
            return res;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(body: Partial<Driver>): Promise<Driver> {
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

    async disactiveDriver(id: string): Promise<Driver> {
        try {
            const respuesta = await this.repository.disactiveDriver(id);
            return respuesta;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    async activateDriver(id: string): Promise<Driver> {
        try {
            const respuesta = await this.repository.activateDriver(id);
            return respuesta;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    async update(id: string, body: Partial<Driver>) {
        try {
            const res = await this.repository.update(id, body);
            if (res.affected === 0)
                throw new NotFoundException(`No se encontró ${this.completeMessage}`);
            return res;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async remove(id: string) {
        try {
            const res = await this.repository.remove(id);
            if (res.affected === 0)
                throw new NotFoundException(`No se encontró ${this.completeMessage}`);
            return res;
        } catch (error) {
            // Normalmente el error de FK es 23503 en Postgres, TypeORM lanza QueryFailedError.
            // ConflictException es adecuado si no se puede borrar por dependencias.
            throw new ConflictException(
                `No se puede eliminar ${this.completeMessage}, posiblemente tenga registros asociados.`,
            );
        }
    }
}
