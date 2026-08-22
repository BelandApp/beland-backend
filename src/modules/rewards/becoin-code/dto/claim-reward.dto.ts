import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ClaimRewardDto {
  @ApiProperty({ description: 'Código de recompensa', example: 'WELCOME100' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Email del usuario que reclama', example: 'usuario@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  gmail: string;
}
