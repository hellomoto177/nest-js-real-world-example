import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDTO } from './create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.find();
  }

  async create(feedbackDTO: CreateFeedbackDTO): Promise<Feedback> {
    return await this.feedbackRepository.save(feedbackDTO);
  }
}
