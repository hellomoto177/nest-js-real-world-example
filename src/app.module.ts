import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { NoteModule } from './modules/note/note.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GroupModule, NoteModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
