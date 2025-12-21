import { PartialType } from '@nestjs/mapped-types';
import { CreateHubProductDto } from './create-hub-product.dto';

export class UpdateHubProductDto extends PartialType(CreateHubProductDto) {}
