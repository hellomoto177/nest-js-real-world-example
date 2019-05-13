import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async getAllTags(expand?: string[]) {
    return await this.tagRepository.find({ relations: [...expand] });
  }

  async getTag(id: number) {
    return await this.tagRepository.findOne(id);
  }

  async createTag(dto: CreateTagDTO) {
    return await this.tagRepository.save(dto);
  }

  async updateTag(id: number, dto: UpdateTagDTO) {
    const target = await this.tagRepository.findOne(id);
    if (!target) {
      throw new HttpException(
        `Tag with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.tagRepository.save({ ...target, ...dto });
  }

  async deleteTag(id: number) {
    return await this.tagRepository.delete(id);
  }
}
