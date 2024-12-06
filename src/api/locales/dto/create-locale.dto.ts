import { IsString, IsOptional } from 'class-validator';

export class CreateLocaleDto {
  @IsString()
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
  tipoLocalId: string;

  @IsString()
  @IsOptional()
  banerLocal?: string;

  lugares?: { lugarTuristicoId: string }[]; // Relación many-to-many con LugaresTuristicos
}

export class UpdateLocaleDto extends CreateLocaleDto {}
