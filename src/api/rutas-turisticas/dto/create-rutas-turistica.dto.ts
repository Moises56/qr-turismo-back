import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRequisitoRutaDto } from './requisito-ruta.dto';

class LugarRutaDto {
  @IsString()
  nombre: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];
}

export class CreateRutasTuristicaDto {
  @IsString()
  nombre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LugarRutaDto)
  lugares: LugarRutaDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lugaresRelIds?: string[]; // IDs opcionales de LugaresTuristicos

  // Nuevos campos opcionales
  @IsOptional()
  @IsString()
  imagen?: string; // URL de la imagen de la ruta

  @IsOptional()
  @IsString()
  responsables?: string; // Nombres de los responsables

  @IsOptional()
  @IsString()
  telefono?: string; // Número de contacto

  @IsOptional()
  @IsUrl()
  urlWeb?: string; // Página web de la ruta

  @IsOptional()
  @IsString()
  tiempoEstimado?: string; // Tiempo estimado (ej: "4-6 horas")

  @IsOptional()
  @IsString()
  cantidadPersonas?: string; // Cantidad de personas (ej: "2-10 personas")

  @IsOptional()
  @IsString()
  costo?: string; // Precio estimado

  @IsOptional()
  horarios?: any; // Horarios flexibles en formato JSON

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequisitoRutaDto)
  requisitos?: CreateRequisitoRutaDto[]; // Requisitos de la ruta
}
