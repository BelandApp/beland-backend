import { ApiProperty } from '@nestjs/swagger';

export class RespGetArrayDto<T> {
  @ApiProperty({ example: 1, description: 'Número de página actual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Cantidad de elementos por página' })
  limit: number;

  @ApiProperty({ example: 42, description: 'Cantidad total de registros encontrados' })
  total: number;

  @ApiProperty({
    isArray: true,
    description: 'Listado de elementos de la página actual',
  })
  data: T[];
}
