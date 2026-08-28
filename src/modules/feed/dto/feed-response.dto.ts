export class FeedProductMediaDto {
  id: string;
  url: string;
  type: string;
  sortOrder: number;
}

export class FeedProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  is_circular: boolean;
  image_url: string;
  category_id: string;
  media: FeedProductMediaDto[];
  likesCount: number;
  isLiked: boolean;
}

export class FeedResponseDto {
  products: FeedProductDto[];
  total: number;
  page: number;
  limit: number;
}
