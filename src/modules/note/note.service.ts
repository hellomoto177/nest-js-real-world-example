import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDTO } from './dto/create-note.dto';

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
}
