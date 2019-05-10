import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import Group from './group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateGroupDTO from './dto/create-group-dto';
import UpdateGroupDTO from './dto/update-group-dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findAllGroups() {
    return await this.groupRepository.find();
  }

  async findGroup(id: number) {
    return await this.groupRepository.findOne(id);
  }

  async createGroup(group: CreateGroupDTO) {
    return await this.groupRepository.save(group);
  }

  async updateGroup(groupId: number, group: UpdateGroupDTO) {
    const target = await this.groupRepository.findOne(groupId);
    if (!target) {
      throw new HttpException(
        `Group with id ${groupId} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.groupRepository.save({ ...target, ...group });
  }

  async deleteGroup(groupId: number) {
    return await this.groupRepository.delete(groupId);
  }
}
