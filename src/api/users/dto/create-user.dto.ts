// src/api/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  empleado: string;

  @IsString()
  password: string;

  @IsEnum(['usuario', 'admin', 'turismo'])
  rol: string;
}
