import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductLike } from '../products/entities/product-like.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ProductMedia } from '../products/entities/product-media.entity';

@Injectable()
export class ExperiencesService {
  private readonly logger = new Logger(ExperiencesService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductLike)
    private readonly likeRepo: Repository<ProductLike>,
    @InjectRepository(ProductMedia)
    private readonly mediaRepo: Repository<ProductMedia>,
  ) {}

  private mapToResponse(product: any) {
    const media = product.media || [];
    const imageMedia = media.find((m: any) => m.type === 'image');
    const videoMedia = media.find((m: any) => m.type === 'video');

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price || 0),
      creator: product.creator_name || 'Beland',
      tags: product.tags || [],
      likes: Number(product.likesCount || 0),
      image_url: imageMedia ? imageMedia.url : (product.image_url || ''),
      video_url: videoMedia ? videoMedia.url : '',
    };
  }

  async findAll() {
    const qb = this.productRepo.createQueryBuilder('product');
    
    qb.leftJoinAndSelect('product.media', 'media')
      .loadRelationCountAndMap('product.likesCount', 'product.likes')
      .where('product.is_experience = :isExp', { isExp: true })
      .orderBy('product.created_at', 'DESC');

    const products = await qb.getMany();
    return products.map(p => this.mapToResponse(p));
  }

  async findOne(id: string) {
    const qb = this.productRepo.createQueryBuilder('product');
    
    qb.leftJoinAndSelect('product.media', 'media')
      .loadRelationCountAndMap('product.likesCount', 'product.likes')
      .where('product.id = :id', { id })
      .andWhere('product.is_experience = :isExp', { isExp: true });

    const product = await qb.getOne();
    if (!product) {
      throw new NotFoundException(`Experience con ID ${id} no encontrada`);
    }

    return this.mapToResponse(product);
  }

  async create(dto: CreateExperienceDto) {
    let savedProductId: string;

    await this.productRepo.manager.transaction(async (manager) => {
      const newProduct = manager.create(Product, {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        creator_name: dto.creator_name || 'Beland',
        tags: dto.tags || [],
        image_url: dto.image_url,
        is_experience: true,
        cost: 0,
        quantity: 0,
        is_circular: false,
      });

      const saved = await manager.save(newProduct);
      savedProductId = saved.id;

      if (dto.video_url) {
        await manager.save(ProductMedia, {
          product_id: saved.id,
          url: dto.video_url,
          type: 'video',
        });
      }
    });

    return this.findOne(savedProductId!);
  }

  async update(id: string, dto: UpdateExperienceDto) {
    // Validar que exista y sea experience
    await this.findOne(id);
    
    await this.productRepo.manager.transaction(async (manager) => {
      await manager.update(Product, id, {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.creator_name !== undefined && { creator_name: dto.creator_name }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.image_url !== undefined && { image_url: dto.image_url }),
      });

      if (dto.video_url !== undefined) {
        const existingMedia = await manager.findOne(ProductMedia, {
          where: { product_id: id, type: 'video' },
        });

        if (existingMedia) {
          if (dto.video_url === '') {
            await manager.remove(existingMedia);
          } else {
            existingMedia.url = dto.video_url;
            await manager.save(existingMedia);
          }
        } else if (dto.video_url !== '') {
          await manager.save(ProductMedia, {
            product_id: id,
            url: dto.video_url,
            type: 'video',
          });
        }
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    // Validar que exista y sea experience
    const product = await this.findOne(id);
    // Soft remove si la app lo usa por defecto, pero acá usaremos el repo original method or delete
    await this.productRepo.softDelete(id);
  }

  async likeExperience(id: string, userId: string) {
    // Verificar que es experience
    await this.findOne(id);
    
    try {
      await this.likeRepo.insert({ product_id: id, user_id: userId });
    } catch (error: any) {
      if (error.code === '23505' || error.message?.includes('unique constraint')) {
        return; // Idempotente
      }
      throw error;
    }
  }

  async unlikeExperience(id: string, userId: string) {
    await this.likeRepo.delete({ product_id: id, user_id: userId });
  }
}
