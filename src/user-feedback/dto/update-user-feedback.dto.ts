import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFeedbackDto } from './create-user-feedback.dto';

export class UpdateUserFeedbackDto extends PartialType(CreateUserFeedbackDto) {}
