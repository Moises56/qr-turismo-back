import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLugaresTuristicoDto {
  @IsString()
  key: string;

  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  ubicacion: string;

  @IsString()
  @IsOptional()
  latitud: string;

  @IsString()
  @IsOptional()
  longitud: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  dias?: string;

  @IsString()
  @IsOptional()
  horarioEntrada?: string;

  @IsString()
  @IsOptional()
  horarioSalida?: string;

  @IsString()
  @IsOptional()
  historia?: string;

  @IsString()
  @IsOptional()
  baner?: string;

  // Agregar locales (relación con Local)
  @IsArray()
  @IsOptional()
  locales?: { localId: string }[];

  // Agregar eventos (relación con Evento)
  @IsArray()
  @IsOptional()
  eventos?: { eventoId: string }[];

  // Agregar galería (relación con ImageItem)
  @IsArray()
  @IsOptional()
  galeria?: { url: string; name: string; description?: string }[];

  @IsArray()
  @IsOptional()
  email?: string;

  //redeSocial
  @IsArray()
  @IsOptional()
  urlWeb?: string;

  @IsArray()
  @IsOptional()
  urlWhatsapp?: string;

  @IsArray()
  @IsOptional()
  urlTiktok?: string;

  @IsArray()
  @IsOptional()
  urlInstagram?: string;

  @IsArray()
  @IsOptional()
  urlFacebook?: string;

  @IsArray()
  @IsOptional()
  urlX?: string;
}

export class UpdateLugaresTuristicosDto extends CreateLugaresTuristicoDto {}

