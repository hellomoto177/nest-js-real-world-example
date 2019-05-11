import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Group } from '../modules/group/group.entity';
import CreateGroupDTO from '../modules/group/dto/create-group.dto';

describe('Group API', () => {
  let app: INestApplication;

  beforeAll(async done => {
    await testingTools.dropDatabase();
    await testingTools.loadFixtures([Group]);

    app = await testingTools.createApp();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe('get groups', () => {
    it('should successfully get all groups', async () => {
      return request(app.getHttpServer())
        .get('/group')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(3);
          expect(body[0].title).toEqual('Standart Notes');
        });
    });

    it('should successfully get specific group by id', async () => {
      return request(app.getHttpServer())
        .get('/group/1')
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(1);
          expect(body.title).toEqual('Standart Notes');
        });
    });
  });

  describe('create groups', () => {
    it('should successfully create new group', async () => {
      const groupRecord: CreateGroupDTO = {
        title: 'new awesome group',
      };
      return request(app.getHttpServer())
        .post('/group')
        .set('Accept', 'application/json')
        .send(groupRecord)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.title).toEqual(groupRecord.title);
        });
    });

    it('should validate not defined title', async () => {
      return request(app.getHttpServer())
        .post('/group')
        .set('Accept', 'application/json')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          const { message } = body;
          expect(Array.isArray(message)).toBeTruthy();

          const { constraints } = message[0];
          expect(constraints.isNotEmpty).toBeDefined();
        });
    });
    it('should validate empty title', async () => {
      return request(app.getHttpServer())
        .post('/group')
        .send({ title: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          const { message } = body;
          expect(Array.isArray(message)).toBeTruthy();

          const { constraints } = message[0];
          expect(constraints.isNotEmpty).toBeDefined();
        });
    });
  });

  describe('update groups', () => {
    it('should successfully update specific group', async () => {
      const target = {
        id: 1,
        title: 'Brand new title',
      };

      return request(app.getHttpServer())
        .patch(`/group/${target.id}`)
        .send({ title: target.title })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toEqual(target.id);
          expect(body.title).toEqual(target.title);
        });
    });

    it('should not update undefined group', async () => {
      return request(app.getHttpServer())
        .patch('/group/99')
        .send({ title: 'You shall not pass' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual("Group with id 99 doesn't exist");
        });
    });
  });

  describe('delete groups', () => {
    it('should successfully delete specific group', async () => {
      return request(app.getHttpServer())
        .delete('/group/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.affected).toEqual(1);
        });
    });
    it('should delete undefined group without errors', async () => {
      return request(app.getHttpServer())
        .delete('/group/99')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.affected).toEqual(0);
        });
    });
  });
});
