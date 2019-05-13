import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDTO } from './dto/create-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/')
  index(@Query('expand') expand?: string) {
    const expands = expand ? expand.split(',') : [];
    return this.tagService.getAllTags(expands);
  }

  @Get('/:id')
  getTag(@Param('id') id: number) {
    return this.tagService.getTag(id);
  }

  @Post('/')
  createTag(@Body() dto: CreateTagDTO) {
    return this.tagService.createTag(dto);
  }

  @Patch('/:id')
  updateTag(@Param('id') id: number, @Body() dto: UpdateTagDTO) {
    return this.tagService.updateTag(id, dto);
  }

  @Delete('/:id')
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }
}
