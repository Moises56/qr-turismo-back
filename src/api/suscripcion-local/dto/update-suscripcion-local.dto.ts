import { PartialType } from '@nestjs/mapped-types';
import { CreateSuscripcionLocalDto } from './create-suscripcion-local.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSuscripcionLocalDto extends PartialType(
  CreateSuscripcionLocalDto,
) {
  @IsString()
  @IsOptional()
  status?: string; // pending, approved, rejected
}
