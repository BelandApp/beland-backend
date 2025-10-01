import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export class Auth0LoginDto {
  @ApiProperty({
    description: 'ID de Auth0 del usuario (opcional)',
    example: 'auth0|abcdef1234567890abcdef1234',
    required: false,
    nullable: true,
  })
  @IsOptional() // auth0_id es opcional
  @IsString({ message: 'auth0_id debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'auth0_id no debe estar vacío si se proporciona.' })
  auth0_id?: string | null;

  @ApiProperty({
    description: 'Correo electrónico del usuario de Auth0 (obligatorio)',
    example: 'usuario@example.com',
    required: true, // Email es obligatorio
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  email: string; // Email es una propiedad requerida

  @ApiProperty({
    description: 'Nombre completo del usuario (opcional, desde Auth0)',
    example: 'John Doe',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'full_name debe ser una cadena de texto.' })
  full_name?: string | null;

  @ApiProperty({
    description: 'URL de la imagen de perfil (opcional, desde Auth0)',
    example: 'https://example.com/photo.jpg',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUrl({}, { message: 'profile_picture_url debe ser una URL válida.' })
  @IsString({ message: 'profile_picture_url debe ser una cadena de texto.' })
  profile_picture_url?: string | null;

  @ApiProperty({
    description: 'Proveedor de autenticación (ej. google, auth0)',
    example: 'google',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'oauth_provider debe ser una cadena de texto.' })
  oauth_provider?: string | null;
}
