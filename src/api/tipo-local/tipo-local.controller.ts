import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TipoLocalService } from './tipo-local.service';
import { CreateTipoLocalDto } from './dto/create-tipo-local.dto';
import { UpdateTipoLocalDto } from './dto/update-tipo-local.dto';

@Controller('tipo-local')
export class TipoLocalController {
  constructor(private readonly tipoLocalService: TipoLocalService) {}

  @Post()
  async create(@Body() createTipoLocalDto: CreateTipoLocalDto) {
    return this.tipoLocalService.create(createTipoLocalDto);
  }

  @Get()
  async findAll() {
    return this.tipoLocalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tipoLocalService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTipoLocalDto: UpdateTipoLocalDto,
  ) {
    return this.tipoLocalService.update(id, updateTipoLocalDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tipoLocalService.remove(id);
  }

  // get filter-by-description
  @Get('filter-by-description/:descripcion')
  async filterByDescription(@Param('descripcion') descripcion: string) {
    return this.tipoLocalService.filterByDescription(descripcion);
  }
}
