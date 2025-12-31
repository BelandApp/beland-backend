import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupServiceDto } from './create-group-service.dto';

export class UpdateGroupServiceDto extends PartialType(CreateGroupServiceDto) {}
