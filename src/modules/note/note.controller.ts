import { Controller, Get, Param, Body, Query, Post } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDTO } from './dto/create-note.dto';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  index(@Query('expand') expand: string) {
    const expands = expand ? expand.split(',') : [];
    return this.noteService.getAllNotes(expands);
  }

  @Get('/:id')
  getNote(id: number) {
    return this.noteService.getNote(id);
  }

  @Post('/')
  createNote(@Body() dto: CreateNoteDTO) {
    console.log('dto:', dto);
    return this.noteService.createNote(dto);
  }
}
