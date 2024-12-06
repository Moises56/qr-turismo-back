import { PartialType } from '@nestjs/mapped-types';
import { CreateLugaresTuristicoDto } from './create-lugares-turistico.dto';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateLugaresTuristicoDto extends PartialType(
  CreateLugaresTuristicoDto,
) {
  @IsOptional()
  @IsArray()
  locales?: { localId: string }[]; // Relación con locales, donde puedes usar connect

  @IsOptional()
  @IsArray()
  eventos?: { eventoId: string }[]; // Relación con eventos, donde puedes usar connect

  @IsOptional()
  @IsArray()
  galeria?: { url: string; name: string; description?: string }[]; // Relación con ImageItem
}
