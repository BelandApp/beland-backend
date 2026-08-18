import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductLike } from '../products/entities/product-like.entity';
import { FeedQueryDto } from './dto/feed-query.dto';
import { FeedResponseDto, FeedProductDto } from './dto/feed-response.dto';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductLike)
    private readonly likeRepo: Repository<ProductLike>,
  ) {}

  async getFeed(userId: string | null, query: FeedQueryDto): Promise<FeedResponseDto> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    // 1. Obtener productos paginados con Media y LikesCount
    const qb = this.productRepo.createQueryBuilder('product');
    
    qb.leftJoinAndSelect('product.media', 'media')
      .loadRelationCountAndMap('product.likesCount', 'product.likes')
      .orderBy('product.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await qb.getManyAndCount();

    // 2. Resolver isLiked para el usuario autenticado (sin N+1)
    let userLikedProductIds = new Set<string>();
    if (userId && products.length > 0) {
      const productIds = products.map((p) => p.id);
      const userLikes = await this.likeRepo.find({
        where: { user_id: userId, product_id: In(productIds) },
        select: ['product_id'],
      });
      userLikedProductIds = new Set(userLikes.map((l) => l.product_id));
    }

    // 3. Mapear al DTO final
    const feedProducts: FeedProductDto[] = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price || 0),
      is_circular: p.is_circular,
      image_url: p.image_url,
      category_id: p.category_id,
      media: (p.media || []).map((m: any) => ({
        id: m.id,
        url: m.url,
        type: m.type,
        sortOrder: m.sortOrder,
      })),
      likesCount: Number(p.likesCount || 0),
      isLiked: userLikedProductIds.has(p.id),
    }));

    return {
      products: feedProducts,
      total,
      page,
      limit,
    };
  }
}
