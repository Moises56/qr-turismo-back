import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // Crear un nuevo evento
  @Post()
  async create(@Body() createEventoDto: CreateEventoDto) {
    // Convierte fechaEvento a un objeto Date si es un string
    if (typeof createEventoDto.fechaEvento === 'string') {
      createEventoDto.fechaEvento = new Date(createEventoDto.fechaEvento);
    }

    return this.eventosService.create(createEventoDto);
  }

  // Obtener todos los eventos
  @Get()
  async findAll() {
    return this.eventosService.findAll();
  }

  // Obtener un evento por ID
  @Get(':id')
  async findOne(@Param('id') idEvento: string) {
    return this.eventosService.findOne(idEvento);
  }

  // Actualizar un evento
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    return this.eventosService.update(id, updateEventoDto);
  }

  // Eliminar un evento
  @Delete(':id')
  async remove(@Param('id') idEvento: string) {
    return this.eventosService.remove(idEvento);
  }
}
