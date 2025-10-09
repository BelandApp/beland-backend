import { PartialType } from '@nestjs/mapped-types';
import { CreateEventPassDto } from './create-event-pass.dto';

export class UpdateEventPassDto extends PartialType(CreateEventPassDto) {}
