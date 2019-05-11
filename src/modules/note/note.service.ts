import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';
import { UpdateNoteDTO } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async getAllNotes(expand: string[]) {
    return await this.noteRepository.find({
      relations: [...expand],
    });
  }

  async getNote(id: number) {
    return await this.noteRepository.findOne(id, {
      relations: ['group'],
    });
  }

  async createNote(dto: CreateNoteDTO) {
    return await this.noteRepository.save(dto);
  }

  async updateNote(id: number, dto: UpdateNoteDTO) {
    const target = await this.noteRepository.findOne(id);
    if (!target) {
      throw new HttpException(
        `Group with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.noteRepository.save({ ...target, ...dto });
  }

  async deleteNote(id: number) {
    return await this.noteRepository.delete(id);
  }
}
