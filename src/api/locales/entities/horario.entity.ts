// src/api/locales/dto/horario.entity.ts
import { IsString, IsOptional } from 'class-validator';

export class Horario {
  @IsString()
  dia: string;

  @IsString()
  @IsOptional()
  apertura?: string;

  @IsString()
  @IsOptional()
  cierre?: string;
}
