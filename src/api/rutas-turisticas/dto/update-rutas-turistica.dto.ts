import { PartialType } from '@nestjs/mapped-types';
import { CreateRutasTuristicaDto } from './create-rutas-turistica.dto';

export class UpdateRutasTuristicaDto extends PartialType(CreateRutasTuristicaDto) {}
