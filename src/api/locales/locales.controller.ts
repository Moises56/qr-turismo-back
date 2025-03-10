import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocalesService } from './locales.service';
import { CreateLocaleDto } from './dto/create-locale.dto';
import { UpdateLocaleDto } from './dto/update-locale.dto';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Post()
  create(@Body() createLocaleDto: CreateLocaleDto) {
    return this.localesService.create(createLocaleDto);
  }

  //get all locales
  @Get()
  findAll() {
    return this.localesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateLocaleDto) {
    return this.localesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localesService.remove(id);
  }

  // Nueva ruta para buscar por tipoLocalId
  @Get('tipoLocal/:tipoLocalId')
  getByTipoLocal(@Param('tipoLocalId') tipoLocalId: string) {
    return this.localesService.findByTipoLocal(tipoLocalId);
  }
}
