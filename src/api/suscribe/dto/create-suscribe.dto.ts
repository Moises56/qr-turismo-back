// export class CreateSuscribeDto {}

import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  IsString,
} from 'class-validator';

export class CreateSuscribeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  artisticName?: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  artistType: string;

  @IsString()
  @IsNotEmpty()
  lugarEvento: string;

  @IsString()
  @IsNotEmpty()
  address: string;


  @IsDateString()
  eventDate: string;

  @IsNotEmpty()
  eventTime: string;

  @IsString()
  @IsOptional()
  banerEvent?: string;

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
}
