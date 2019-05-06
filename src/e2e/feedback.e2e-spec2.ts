import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { FeedbackModule } from '../modules/feedback/feedback.module';
import { FeedbackService } from '../modules/feedback/feedback.service';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Feedback', () => {
  let app: INestApplication;
  let feedbackService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'user',
          password: 'password',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
        FeedbackModule,
      ],
    })
      .overrideProvider(FeedbackService)
      .useValue(feedbackService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`/GET feedback`, () => {
    return request(app.getHttpServer())
      .get('/feedback')
      .expect(200)
      .expect({
        data: feedbackService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
