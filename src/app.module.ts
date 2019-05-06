import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './modules/feedback/feedback.controller';
import { FeedbackService } from './modules/feedback/feedback.service';
import { FeedbackModule } from './modules/feedback/feedback.module';

@Module({
  imports: [TypeOrmModule.forRoot(), FeedbackModule],
  controllers: [AppController, FeedbackController],
  providers: [AppService, FeedbackService],
})
export class AppModule {}
