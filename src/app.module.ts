import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';

@Module({
  imports: [TypeOrmModule.forRoot(), GroupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
