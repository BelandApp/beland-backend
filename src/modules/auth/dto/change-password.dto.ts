import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email del usuario que solicita el cambio de contraseña',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Nueva contraseña del usuario (mínimo 8 caracteres, con mayúsculas, minúsculas, número y símbolo)',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).*$/, {
    message:
      'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Confirmación de la nueva contraseña (debe coincidir con password)',
  })
  @IsString({ message: 'La confirmación de la contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria' })
  confirmPassword: string;
}
