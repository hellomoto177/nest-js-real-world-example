import {
  Controller,
  Get,
  Param,
  Body,
  Query,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { CreateTagDTO } from '../tag/dto/create-tag.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  index(@Query('expand') expand: string) {
    const expands = expand ? expand.split(',') : [];
    return this.noteService.getAllNotes(expands);
  }

  @Get('/:id')
  getNote(@Param('id') id: number) {
    return this.noteService.getNote(id);
  }

  @Post('/')
  createNote(@Body() dto: CreateNoteDTO) {
    return this.noteService.createNote(dto);
  }

  @Post('/:id/tag')
  addTag(@Param('id') id: number, @Body() dto: CreateTagDTO) {
    return this.noteService.addTag(id, dto);
  }

  @Delete('/:id/tag')
  deleteTag(@Param('id') id: number, @Body() dto: CreateTagDTO) {
    return this.noteService.deleteTag(id, dto);
  }

  @Patch('/:id')
  updateNote(@Param('id') id: number, @Body() dto: UpdateNoteDTO) {
    return this.noteService.updateNote(id, dto);
  }

  @Delete('/:id')
  deleteNote(@Param('id') id: number) {
    return this.noteService.deleteNote(id);
  }
}
