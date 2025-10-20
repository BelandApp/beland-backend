import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEventPassDto } from './create-user-event-pass.dto';

export class UpdateUserEventPassDto extends PartialType(CreateUserEventPassDto) {}
