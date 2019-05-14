import {
  Controller,
  Get,
  Param,
  Body,
  Query,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { NoteService } from './note.service';
import {
  ApiImplicitQuery,
  ApiUseTags,
  ApiOkResponse,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateNoteDTO, UpdateNoteDTO, ResponseNoteDTO } from './note.dto';
import { DeleteResult } from 'typeorm';
import { CreateTagDTO } from '../tag/tag.dto';

@Controller('notes')
@ApiUseTags('Notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  @ApiOkResponse({ type: ResponseNoteDTO, isArray: true })
  @ApiOperation({ title: 'Get all notes' })
  @ApiImplicitQuery({ name: 'expand', required: false })
  index(@Query('expand') expand?: string): Promise<ResponseNoteDTO[]> {
    const expands = expand ? expand.split(',') : [];
    return this.noteService.getAllNotes(expands);
  }

  @Get('/:id')
  @ApiOkResponse({ type: ResponseNoteDTO })
  @ApiOperation({ title: 'Get note by id' })
  getNote(@Param('id') id: number): Promise<ResponseNoteDTO> {
    return this.noteService.getNote(id);
  }

  @Post('/')
  @ApiCreatedResponse({ type: ResponseNoteDTO })
  @ApiOperation({ title: 'Create new note' })
  createNote(@Body() dto: CreateNoteDTO): Promise<ResponseNoteDTO> {
    return this.noteService.createNote(dto);
  }

  @Post('/:id/tag')
  @ApiCreatedResponse({ type: ResponseNoteDTO })
  @ApiOperation({ title: 'Add tag to note' })
  addTag(
    @Param('id') id: number,
    @Body() dto: CreateTagDTO,
  ): Promise<ResponseNoteDTO> {
    return this.noteService.addTag(id, dto);
  }

  @Delete('/:id/tag')
  @ApiOkResponse({ type: ResponseNoteDTO })
  @ApiOperation({ title: 'Delete tag from note' })
  deleteTag(
    @Param('id') id: number,
    @Body() dto: CreateTagDTO,
  ): Promise<ResponseNoteDTO> {
    return this.noteService.deleteTag(id, dto);
  }

  @Put('/:id')
  @ApiOkResponse({ type: ResponseNoteDTO })
  @ApiOperation({ title: 'Update note by id' })
  updateNote(
    @Param('id') id: number,
    @Body() dto: UpdateNoteDTO,
  ): Promise<ResponseNoteDTO> {
    return this.noteService.updateNote(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: DeleteResult })
  @ApiOperation({ title: 'Delete note by id' })
  deleteNote(@Param('id') id: number): Promise<DeleteResult> {
    return this.noteService.deleteNote(id);
  }
}
