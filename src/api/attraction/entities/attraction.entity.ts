// src/attraction/attraction.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class Attraction {
  @ApiProperty({ description: 'ID de la atracción' })
  id: string;

  @ApiProperty({ description: 'Nombre de la atracción' })
  nombre: string;

  @ApiProperty({ description: 'Descripción de la atracción', required: false })
  descripcion?: string;
}
