import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LugaresTuristicosService } from './lugares-turisticos.service';
import { CreateLugaresTuristicoDto } from './dto/create-lugares-turistico.dto';
import { UpdateLugaresTuristicoDto } from './dto/update-lugares-turistico.dto';

@Controller('lugares-turisticos')
export class LugaresTuristicosController {
  constructor(
    private readonly lugaresTuristicosService: LugaresTuristicosService,
  ) {}

  @Post()
  create(@Body() createLugaresTuristicoDto: CreateLugaresTuristicoDto) {
    return this.lugaresTuristicosService.create(createLugaresTuristicoDto);
  }

  // @Get()
  // findAll(
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 10,
  //   @Query('search') search = '',
  // ) {
  //   // Ensure limit does not exceed a reasonable maximum
  //   limit = Math.min(limit, 100);
  //   return this.lugaresTuristicosService.findAll({
  //     page: Number(page),
  //     limit: Number(limit),
  //     search,
  //   });
  // }

  // @Get()
  // async findAll(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  //   limit: number = 10,
  //   @Query('search') search: string = '',
  // ) {
  //   return this.lugaresTuristicosService.findAll({
  //     page,
  //     limit,
  //     search,
  //   });
  // }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return this.lugaresTuristicosService.findAll({
      page,
      limit,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugaresTuristicosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLugaresTuristicoDto: UpdateLugaresTuristicoDto,
  ) {
    return this.lugaresTuristicosService.update(id, updateLugaresTuristicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lugaresTuristicosService.remove(id);
  }
}
