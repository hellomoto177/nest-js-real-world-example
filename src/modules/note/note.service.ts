import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { CreateTagDTO } from '../tag/dto/create-tag.dto';
import { Tag } from '../tag/tag.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getAllNotes(expand: string[]) {
    return await this.noteRepository.find({
      relations: [...expand],
    });
  }

  async getNote(id: number) {
    return await this.noteRepository.findOne({
      where: { id },
      relations: ['group', 'tags'],
    });
  }

  async createNote(dto: CreateNoteDTO) {
    return await this.noteRepository.save(dto);
  }

  async updateNote(id: number, dto: UpdateNoteDTO) {
    const target = await this.noteRepository.findOne(id);
    if (!target) {
      throw new HttpException(
        `Note with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.noteRepository.save({ ...target, ...dto });
  }

  async deleteNote(id: number) {
    return await this.noteRepository.delete(id);
  }

  async addTag(noteId: number, dto: CreateTagDTO) {
    let tag: Tag;
    tag = await this.tagRepository.findOne({
      where: { name: dto.name },
    });

    if (!tag) {
      tag = await this.tagRepository.save(dto);
    }

    const note = await this.noteRepository.findOne(noteId, {
      relations: ['tags'],
    });

    if (!note.tags.some(existedTag => existedTag.name === tag.name)) {
      note.tags.push(tag);
    }

    return await this.noteRepository.save(note);
  }

  async deleteTag(noteId: number, dto: CreateTagDTO) {
    const note = await this.noteRepository.findOne(noteId, {
      relations: ['tags'],
    });

    note.tags = note.tags.filter(tag => tag.name !== dto.name);

    return await this.noteRepository.save(note);
  }
}
