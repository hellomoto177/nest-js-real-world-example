import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Group from '../group/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
})
export class NoteModule {}
