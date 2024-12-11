import { IsString, IsOptional } from 'class-validator';

export class CreateImageItemDto {
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  lugarId: string; // Relación con el lugar turístico
}
