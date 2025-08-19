import { IsString } from 'class-validator';

export class CreateRequisitoRutaDto {
  @IsString()
  tipo: string; // "vestimenta", "accesibilidad", "equipo", etc.

  @IsString()
  detalle: string; // Descripción específica del requisito
}

export class RequisitoRutaDto extends CreateRequisitoRutaDto {
  id?: string;
  rutaId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
