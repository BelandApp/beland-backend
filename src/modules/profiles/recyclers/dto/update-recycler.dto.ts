import { PartialType } from '@nestjs/mapped-types';
import { CreateRecyclerBaseDto } from './create-recycler.dto';

export class UpdateRecyclerBaseDto extends PartialType(CreateRecyclerBaseDto) {}
