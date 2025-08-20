import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateSuscripcionLocalDto {
  @IsString()
  @IsOptional()
  nombreLocal?: string;

  @IsString()
  @IsOptional()
  tipoLocal?: string;

  @IsString()
  @IsOptional()
  latitud?: string;

  @IsString()
  @IsOptional()
  longitud?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  @MinLength(13)
  @MaxLength(14)
  rtnDni?: string;

  @IsString()
  @IsOptional()
  permisoOperacion?: string;

  @IsString()
  @IsOptional()
  telefonoLocal?: string;

  @IsString()
  @IsOptional()
  nombrePropietario?: string;

  @IsString()
  @IsOptional()
  telefonoPropietario?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  urlWeb?: string;

  @IsString()
  @IsOptional()
  urlWhatsapp?: string;

  @IsString()
  @IsOptional()
  urlTiktok?: string;

  @IsString()
  @IsOptional()
  urlInstagram?: string;

  @IsString()
  @IsOptional()
  urlFacebook?: string;

  @IsString()
  @IsOptional()
  urlX?: string;

  @IsString()
  @IsOptional()
  registroNacionalTurismo?: string; // Número o ID del registro nacional de turismo

  @IsUrl()
  @IsOptional()
  urlImagenRegistroTurismo?: string; // URL de la imagen del registro nacional de turismo

  @IsString()
  @IsOptional()
  tipoLocalId?: string;
}
