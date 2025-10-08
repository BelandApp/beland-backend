import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserResource } from './entities/user-resource.entity';
import { TransferResource } from './entities/transfer-resource.entity';

@Injectable()
export class UserResourcesRepository {
  constructor(
    @InjectRepository(UserResource)
    private repository: Repository<UserResource>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    user_id: string,
    resource_id:string,
    page: number,
    limit: number,
  ): Promise<[UserResource[], number]> {
    let where: any = {};
    where.user_id = user_id;

    if (resource_id !== '') {
      where.resource_id = resource_id;
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {resource:true}
    });
  } 

  async findAllCommerceTransfer(
      user_id: string,
      page: number,
      limit: number,
      status_id?:string,
    ): Promise<[TransferResource[], number]> {
      let where: any = {
        payment_account: {
          user_id,
        },
      };
      if (status_id) where.status_id = status_id;
      
      return await this.dataSource.manager.findAndCount(TransferResource, {
          where,
          order: { created_at: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
          relations: {user:true, status:true, resource:true},
      });
  } 

  async findAllUserTransfer(
      user_id: string,
      page: number,
      limit: number,
      status_id?:string,
    ): Promise<[TransferResource[], number]> {
      let where: any = {}
      where.user_id = user_id;
      if (status_id) where.status_id = status_id;
      
      return await this.dataSource.manager.findAndCount(TransferResource, {
          where,
          order: { created_at: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
          relations: {resource:true, status:true},
      });
  } 

  async findOne(id: string): Promise<UserResource> {
    return this.repository.findOne({
      where: { id },
      relations: {resource:true}
    });
  }

  async create(body: Partial<UserResource>): Promise<UserResource> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<UserResource>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
