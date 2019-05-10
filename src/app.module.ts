import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GroupModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
