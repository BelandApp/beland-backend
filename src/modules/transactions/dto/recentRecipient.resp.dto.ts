import { ApiProperty } from '@nestjs/swagger';

export class RecentRecipientDto {
  @ApiProperty({ example: 'uuid-del-wallet', description: 'ID del wallet del destinatario' })
  wallet_id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del destinatario' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del destinatario' })
  full_name: string;

  @ApiProperty({ example: 'juanp', description: 'Nombre de usuario del destinatario' })
  username: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Foto de perfil del destinatario' })
  picture: string;
}
