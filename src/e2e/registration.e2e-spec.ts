import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Note } from '../modules/note/note.entity';
import { Group } from '../modules/group/group.entity';
import { Tag } from '../modules/tag/tag.entity';
import { CreateTagDTO } from 'src/modules/tag/tag.dto';

describe('Registration', () => {
  let app: INestApplication;

  beforeAll(async done => {
    app = await testingTools.createApp();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe('validation', () => {
    it('should ask all required fields', async () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send('')
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          const { message } = body;
          expect(message).toBeDefined();
          expect(message).toHaveLength(4);

          message.forEach(errItem => {
            // Email
            if (errItem.property === 'email') {
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'isDefined',
                ),
              ).toBeTruthy();
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'isEmail',
                ),
              ).toBeTruthy();
            }

            // Password
            if (errItem.property === 'password') {
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'isDefined',
                ),
              ).toBeTruthy();
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'minLength',
                ),
              ).toBeTruthy();
            }

            // First name
            if (errItem.property === 'firstName') {
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'isDefined',
                ),
              ).toBeTruthy();
            }

            // Last name
            if (errItem.property === 'lastName') {
              expect(
                Object.keys(errItem.constraints).some(
                  errName => errName === 'isDefined',
                ),
              ).toBeTruthy();
            }
          });
        });
    });
  });
});
