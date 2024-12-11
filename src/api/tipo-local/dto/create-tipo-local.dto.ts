import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoLocalDto {
  @IsNotEmpty()
  @IsString()
  nombreTipo: string;

  @IsNotEmpty()
  @IsString()
  icoTipo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
