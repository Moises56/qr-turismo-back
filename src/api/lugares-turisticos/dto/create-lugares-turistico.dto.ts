import { IsString, IsOptional } from 'class-validator';

export class CreateLugaresTuristicoDto {
  @IsString()
  key: string;

  @IsString()
  nombre: string;

  @IsString()
  ubicacion: string;

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
}

export class UpdateLugaresTuristicosDto extends CreateLugaresTuristicoDto {}
