import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UserEventPassFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID del usuario comprador',
    example: '8b5c6a3e-12f9-4b1a-bf11-52e20a2fabc1',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del evento (EventPass)',
    example: 'a9b8c7d6-1234-5678-9abc-def012345678',
  })
  @IsOptional()
  @IsUUID()
  event_pass_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por si la entrada fue consumida o no',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_consumed?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por si la entrada está activa o no',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por si la entrada fue reembolsada o no',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_refunded?: boolean;
}
