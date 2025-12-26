import { PartialType } from '@nestjs/mapped-types';
import { CreateFoundationDto } from './create-foundation.dto';

export class UpdateFoundationDto extends PartialType(CreateFoundationDto) {}
