// export class CreateSuscribeDto {}

import { IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateSuscribeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  artisticName?: string;

  @IsNotEmpty()
  dni: string;

  @IsNotEmpty()
  artistType: string;

  @IsNotEmpty()
  lugarEvento: string;

  @IsNotEmpty()
  address: string;

  @IsDateString()
  eventDate: string;

  @IsNotEmpty()
  eventTime: string;

  @IsOptional()
  banerEvent?: string;
}
