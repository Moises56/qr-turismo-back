import { IsString, IsOptional } from 'class-validator';

export class CreateLocaleDto {
  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  horario?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  tipoLocalId: string;

  @IsString()
  @IsOptional()
  banerLocal?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  latitud?: string;

  @IsString()
  @IsOptional()
  longitud?: string;

  @IsString()
  @IsOptional()
  urlWeb?: string;

  @IsString()
  @IsOptional()
  urlWhatsapp?: string;

  @IsString()
  @IsOptional()
  urlFacebook?: string;

  @IsString()
  @IsOptional()
  urlInstagram?: string;

  @IsString()
  @IsOptional()
  urlTiktok?: string;

  @IsString()
  @IsOptional()
  urlX?: string;

  lugares?: { lugarTuristicoId: string }[]; // Relación many-to-many con LugaresTuristicos
}

export class UpdateLocaleDto extends CreateLocaleDto {}
