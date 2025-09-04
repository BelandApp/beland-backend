import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateEmailDto {
    @ApiProperty({ description: 'Email del destinatario' })
    @IsEmail()
    to: string; 

    @ApiProperty({ description: 'Asunto del email' })
    @IsString()
    subject: string;

    @ApiProperty({ description: 'Texto a incluir en caso de que falle el html, Puede ser la misma informacion del html pero sin estilos' })
    @IsString()
    text: string; 

    @ApiProperty({ description: 'HTML con la informacion estilizada.' })
    @IsString()
    html?: string;
}
