import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageItemService } from './image-item.service';
import { CreateImageItemDto } from './dto/create-image-item.dto';
import { UpdateImageItemDto } from './dto/update-image-item.dto';

@Controller('image-item')
export class ImageItemController {
  constructor(private readonly imageItemService: ImageItemService) {}

  @Post()
  create(@Body() createImageItemDto: CreateImageItemDto) {
    return this.imageItemService.create(createImageItemDto);
  }

  @Get()
  findAll() {
    return this.imageItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageItemDto: UpdateImageItemDto,
  ) {
    return this.imageItemService.update(id, updateImageItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageItemService.remove(id);
  }
}
