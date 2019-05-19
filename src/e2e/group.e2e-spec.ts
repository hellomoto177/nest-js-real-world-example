import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Group } from '../modules/group/group.entity';
import { CreateGroupDTO } from '../modules/group/group.dto';
import { CreateUserDTO } from 'src/modules/user/user.dto';

describe('Group API', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async done => {
    await testingTools.dropDatabase();
    await testingTools.loadFixtures([Group]);

    token = await testingTools.register();
    app = await testingTools.createApp();

    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe('get groups', () => {
    it('should reject because of authorization', async () => {
      return request(app.getHttpServer())
        .get('/group')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully get all groups', async () => {
      return request(app.getHttpServer())
        .get('/group')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveLength(3);
          expect(body[0].title).toEqual('Standart Notes');
        });
    });

    it('should successfully get specific group by id', async () => {
      return request(app.getHttpServer())
        .get('/group/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .put(`/group/${target.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: target.title })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toEqual(target.id);
          expect(body.title).toEqual(target.title);
        });
    });

    it('should not update undefined group', async () => {
      return request(app.getHttpServer())
        .put('/group/99')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.affected).toEqual(1);
        });
    });
    it('should delete undefined group without errors', async () => {
      return request(app.getHttpServer())
        .delete('/group/99')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.affected).toEqual(0);
        });
    });
  });
});
