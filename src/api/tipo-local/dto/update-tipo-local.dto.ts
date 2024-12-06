import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoLocalDto } from './create-tipo-local.dto';

export class UpdateTipoLocalDto extends PartialType(CreateTipoLocalDto) {}
