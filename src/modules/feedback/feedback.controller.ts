import { Controller, Get, Post, Body } from '@nestjs/common';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  index(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Post('create')
  create(@Body() feedbackData: Feedback): Promise<any> {
    return this.feedbackService.create(feedbackData);
  }
}
