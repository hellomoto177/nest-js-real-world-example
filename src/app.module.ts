import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { NoteModule } from './modules/note/note.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from './modules/config/config.service';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(),
    GroupModule,
    NoteModule,
    TagModule,
    UserModule,
    AuthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
