import { IsString, IsOptional } from 'class-validator';

export class CreateAttractionDto {
  @IsString()
  nombre?: string;

  @IsString()
  descripcion?: string;

  @IsString()
  imgAtractions?: string;

  @IsOptional()
  @IsString()
  lugarId?: string;
}
