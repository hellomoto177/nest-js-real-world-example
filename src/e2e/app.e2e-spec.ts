import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import TestUtils from './utils';
import { Feedback } from '../modules/feedback/feedback.entity';

describe('Feedback API', () => {
  let app: INestApplication;

  beforeAll(async done => {
    await TestUtils.dropDatabase();
    await TestUtils.loadFixtures([Feedback]);

    app = await TestUtils.startApplication();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  it('should take all feedback', async done => {
    request(app)
      .get('/feedback')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        const elem = body[0];
        expect(elem.authorName).toEqual('Dostoevskiy Fedor');
        expect(elem.authorDescription).toEqual('Great Russian writer');
        expect(elem.text).toEqual(
          "It is awesome test. I've never ever seen so amazing fixture before!",
        );
      });
    done();
  });

  it('should not create new feedback because of validation error', async done => {
    request(app)
      .post('/feedback/create')
      .send({ authorName: 'Stephen King' })
      .expect(HttpStatus.BAD_REQUEST)
      .expect(({ body }) => {
        const { message } = body;
        expect(Array.isArray(message)).toBeTruthy();

        const { constraints } = message[0];
        expect(constraints.isDefined).toBeDefined();
        expect(constraints.minLength).toBeDefined();
      });
    done();
  });

  it('should create new feedback', async done => {
    const feedExample = {
      authorName: 'Stephen King',
      authorDescription: 'Some description',
      text: 'really long text',
    };

    request(app)
      .post('/feedback/create')
      .send(feedExample)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.authorName).toEqual(feedExample.authorName);
        expect(body.authorDescription).toEqual(feedExample.authorDescription);
        expect(body.text).toEqual(feedExample.text);
      })
      .expect(HttpStatus.CREATED);
    done();
  });
});
