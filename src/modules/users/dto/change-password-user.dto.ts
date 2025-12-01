import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class ChangePasswordUserDto {
  
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'MiClaveActual123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria.' })
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña que se desea establecer',
    example: 'NuevaClaveSegura123!',
  })
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(50, { message: 'La nueva contraseña debe tener como máximo 50 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'La nueva contraseña debe incluir mayúsculas, minúsculas y números.',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmación de la nueva contraseña',
    example: 'NuevaClaveSegura123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria.' })
  confirmPassword: string;
}
