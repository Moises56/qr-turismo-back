import { PartialType } from '@nestjs/mapped-types';
import { CreateLugaresTuristicoDto } from './create-lugares-turistico.dto';

export class UpdateLugaresTuristicoDto extends PartialType(
  CreateLugaresTuristicoDto,
) {}
