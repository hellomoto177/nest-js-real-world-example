import { Injectable, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(@Param('id') id: number) {
    return await this.userRepository.findOne(id);
  }

  async create(dto: CreateUserDTO) {
    return await this.userRepository.save(dto);
  }

  async update(id: number, dto: UpdateUserDTO) {
    const user = this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        `User with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userRepository.save({ ...user, ...dto });
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }
}
