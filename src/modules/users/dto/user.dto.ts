import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
    nullable: true,
  })
  full_name: string | null;

  @Expose()
  @ApiProperty({
    description: 'URL de la imagen de perfil',
    example: 'https://example.com/photo.jpg',
    nullable: true,
  })
  profile_picture_url: string | null;

  @Expose()
  @ApiProperty({
    description: 'Rol de autoridad del usuario',
    example: 'USER',
    nullable: true,
  })
  @Transform(({ obj, value }) => value ?? obj.role?.name ?? null)
  role_name: string | null;

  @Expose()
  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123, Ciudad',
    nullable: true,
  })
  address: string | null;

  @Expose()
  @ApiProperty({
    description: 'Número de teléfono',
    example: '1234567890',
    nullable: true,
  })
  phone: string | null;

  @Expose()
  @ApiProperty({
    description: 'País del usuario',
    example: 'Argentina',
    nullable: true,
  })
  country: string | null;

  @Expose()
  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Buenos Aires',
    nullable: true,
  })
  city: string | null;

  @Expose()
  @ApiProperty({
    description: 'Indica si el usuario está bloqueado',
    example: false,
  })
  isBlocked: boolean;

  @Expose()
  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'Peso total reciclado por el usuario',
    example: 12.5,
    nullable: true,
  })
  total_weight_recycled: number;

  @Expose()
  @ApiProperty({
    description: 'Perfiles funcionales asignados al usuario',
    example: ['MERCHANT', 'DRIVER'],
    type: [String],
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
          .map((profile) => profile?.profile?.name ?? profile?.name ?? null)
          .filter(Boolean)
      : [],
  )
  profiles: string[];
}
