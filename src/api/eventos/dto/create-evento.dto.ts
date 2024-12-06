import {
  IsString,
  IsDate,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';

export class CreateEventoDto {
  @IsString()
  nombreEvento: string;

  @IsString()
  descripcionEvento: string;

  @IsDate()
  fechaEvento: Date;

  @IsString()
  tipoEvento: string;

  @IsString()
  organizador: string;

  @IsString()
  invitados: string;

  @IsUrl()
  banerEvento: string; // Ahora obligatorio

  @IsString()
  direccionEvento: string;

  @IsArray()
  @ArrayNotEmpty()
  lugaresIds: string[];
}
