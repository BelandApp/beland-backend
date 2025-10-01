import { PartialType } from '@nestjs/mapped-types';
import { CreateRechargeTransferDto } from './create-user-recharge.dto';

export class UpdateUserRechargeDto extends PartialType(CreateRechargeTransferDto) {}
