import { IsString, IsOptional, IsDate, IsUrl, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventoDto {
  @IsString()
  @IsOptional()
  nombreEvento?: string;

  @IsString()
  @IsOptional()
  descripcionEvento?: string;

  @IsDate()
  @Type(() => Date) // Convierte automáticamente a tipo `Date` si se proporciona
  @IsOptional()
  fechaEvento?: Date;

  @IsString()
  @IsOptional()
  tipoEvento?: string;

  @IsString()
  @IsOptional()
  organizador?: string;

  @IsString()
  @IsOptional()
  invitados?: string;

  @IsUrl()
  @IsOptional()
  banerEvento?: string;

  @IsString()
  @IsOptional()
  direccionEvento?: string;

  @IsArray()
  @IsOptional()
  lugaresIds?: string[];
}
