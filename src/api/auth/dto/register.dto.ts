// src/api/auth/dto/register.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['usuario', 'admin', 'turismo'])
  @IsOptional()
  rol?: string;

  @IsString()
  @IsOptional()
  empleado?: string; // # empleado
}
