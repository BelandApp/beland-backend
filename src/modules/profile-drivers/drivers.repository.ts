import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, FindOptionsWhere, ILike, Repository, UpdateResult } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { Profile } from '../users/entities/profile.entity';
import { UserProfile } from '../users/entities/profile-user.entity';
import { ProfileEnum } from '../users/enums/profiles.enum';
import { DriverQueryDto } from './dto/driver-query.dto';
import { RespGetArrayDto, RespGetTypeDto } from 'src/dto/resp-app.dto';
import { Vehicle } from './entities/vehicle.entity';
import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';

@Injectable()
export class DriversRepository {
    constructor(
        @InjectRepository(Driver)
        private repository: Repository<Driver>,
        private readonly dataSource: DataSource,
    ) { }

    async findAll(
    query: DriverQueryDto,
    page: number,
    limit: number,
    ): Promise<RespGetArrayDto<Driver>> {

    const where: FindOptionsWhere<Driver> = {};

    // --- FILTROS ---
    if (query.user_id) where.user_id = query.user_id;

    if (query.vehicle_type_id) where.vehicle_type_id = query.vehicle_type_id;

    if (query.is_active !== undefined) {
        where.is_active = query.is_active === 'true';
    }

    if (query.vehicle_plate) {
        where.vehicle_plate = ILike(`%${query.vehicle_plate}%`);
    }

    if (query.vehicle_description) {
        where.vehicle_description = ILike(`%${query.vehicle_description}%`);
    }

    // --- ORDEN ---
    const orderBy = query.orderBy ?? 'created_at';
    const order = query.order ?? 'DESC';

    const resp = await this.repository.findAndCount({
        where,
        order: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user', 'work_address', 'vehicle_type'],
    });
    return {page, limit, total: resp[1], data:resp[0]}
    }

    async findAllVehicleType (): Promise<RespGetTypeDto<Vehicle>> {
        const resp = await this.dataSource.manager.findAndCount(Vehicle)
        return {data:resp[0], total:resp[1]}
    }

    async findOne(id: string): Promise<Driver> {
        return this.repository.findOne({
            where: { id },
            relations: ['user', 'work_address'],
        });
    }

    async findByUser(user_id: string): Promise<Driver> {
        return this.repository.findOne({
            where: { user_id },
            relations: ['user', 'work_address'],
        });
    }

    async create(body: Partial<Driver>): Promise<Driver> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const driver = queryRunner.manager.create(Driver, body);
        const savedDriver = await queryRunner.manager.save(driver);

        await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.DRIVER,
        );

        await queryRunner.commitTransaction();
        return savedDriver;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
    }

    async disactiveDriver(id: string): Promise<Driver> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const driver = await queryRunner.manager.findOne(Driver, {
        where: { id },
        });

        if (!driver) {
        throw new NotFoundException('No se encontró el Conductor');
        }

        // 1. Desactivar Driver
        driver.is_active = false;
        const savedDriver = await queryRunner.manager.save(driver);

        // 2. Remover perfil DRIVER
        await removeProfileFromUser(
        queryRunner,
        driver.user_id,
        ProfileEnum.DRIVER,
        );

        await queryRunner.commitTransaction();
        return savedDriver;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
    }

    async activateDriver(id: string): Promise<Driver> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const driver = await queryRunner.manager.findOne(Driver, {
        where: { id },
        });

        if (!driver) {
        throw new NotFoundException('No se encontró el Conductor');
        }

        // 1. Activar Driver
        driver.is_active = true;
        const savedDriver = await queryRunner.manager.save(driver);

        // 2. Asignar perfil DRIVER
        await assignProfileToUser(
        queryRunner,
        driver.user_id,
        ProfileEnum.DRIVER,
        );

        await queryRunner.commitTransaction();
        return savedDriver;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
    }

    async update(id: string, body: Partial<Driver>): Promise<UpdateResult> {
        return await this.repository.update(id, body);
    }

    async remove(id: string): Promise<DeleteResult> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const driver = await queryRunner.manager.findOne(Driver, {
                where: { id },
            });

            let deleteResult: DeleteResult = { raw: [], affected: 0 };

            if (driver) {
                // 1. Eliminar profile de user-profile antes de borrar driver
                const profile = await queryRunner.manager.findOne(Profile, {
                    where: { name: ProfileEnum.DRIVER },
                });

                if (profile) {
                    const userProfile = await queryRunner.manager.findOne(UserProfile, {
                        where: { user_id: driver.user_id, profile_id: profile.id },
                    });
                    if (userProfile) {
                        await queryRunner.manager.delete(UserProfile, userProfile.id);
                    }
                }

                // 2. Eliminar driver
                deleteResult = await queryRunner.manager.delete(Driver, id);
            }

            await queryRunner.commitTransaction();

            if (!driver) return await this.repository.delete(id);

            return deleteResult;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
