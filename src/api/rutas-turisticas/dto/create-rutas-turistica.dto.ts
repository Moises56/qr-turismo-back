import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
}
