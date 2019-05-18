import { Injectable, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, UpdateUserDTO, ResponseUserDTO } from './user.dto';
import { LoginDTO } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByPayload(dto: LoginDTO) {
    const { email } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (dto.password !== user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.sanitizeUser(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(@Param('id') id: number) {
    return await this.userRepository.findOne(id);
  }

  async create(dto: CreateUserDTO) {
    const { email } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      const errors = { username: 'User already exists.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // TODO: encrypt password
    const createdUser = await this.userRepository.save(dto);
    return this.sanitizeUser(createdUser);
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

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
