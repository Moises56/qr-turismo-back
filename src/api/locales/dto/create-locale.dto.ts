import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLocaleDto {
  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // If the value is already a valid Prisma Json input, return it
    return value; // Let Prisma handle the conversion
  })
  horario?: any;

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

  @IsArray()
  @IsOptional()
  lugaresIds?: string[];
}

export class UpdateLocaleDto extends CreateLocaleDto {}
