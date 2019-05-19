import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { Note } from './note.entity';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30, // seconds
      max: 1000, // maximum number of items in cache
    }),
    AuthModule,
    TypeOrmModule.forFeature([Note]),
    TagModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
