import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Note } from '../modules/note/note.entity';
import { Group } from '../modules/group/group.entity';
import { Tag } from '../modules/tag/tag.entity';
import { CreateTagDTO } from 'src/modules/tag/tag.dto';

describe('Tag API', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async done => {
    await testingTools.dropDatabase();
    await testingTools.loadFixtures([Group]);
    await testingTools.loadFixtures([Note]);
    await testingTools.loadFixtures([Tag]);
    await testingTools.loadFixtures([{ name: 'Tag-Notes-Relation' }]);

    token = await testingTools.register();

    app = await testingTools.createApp();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe('get tags', () => {
    it('should reject because of authorization', async () => {
      return request(app.getHttpServer())
        .get('/tags')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully get all tags', async () => {
      return request(app.getHttpServer())
        .get('/tags')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveLength(3);
          body.forEach(tag => {
            expect(tag.notes).toBeUndefined();
          });
        });
    });

    it('should successfully get all tags with list of notes', async () => {
      return request(app.getHttpServer())
        .get('/tags?expand=notes')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveLength(3);
          const hasNotes = body.some((tag: any) => tag.notes.length > 0);
          expect(hasNotes).toBeTruthy();
        });
    });

    it('should successfully get specific tag by id', async () => {
      return request(app.getHttpServer())
        .get('/tags/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('name');
        });
    });
  });

  describe('create tag', () => {
    it('should successfully create new tag', async () => {
      const dto: CreateTagDTO = {
        name: 'typical tag name',
      };

      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id');
          expect(body.name).toEqual(dto.name);
        });
    });

    it('should validate tag with empty name', async () => {
      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body).toHaveProperty('message');
          expect(body.message).toHaveLength(1);
          expect(body.message[0].constraints).toHaveProperty('isDefined');
          expect(body.message[0].constraints.isDefined).toContain('name');
        });
    });
  });

  describe('update tags', () => {
    it('should successfully update specific tag', async () => {
      const dto = {
        id: 1,
        name: 'Brand new title',
      };

      return request(app.getHttpServer())
        .put(`/tags/${dto.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: dto.name })
        .expect(HttpStatus.OK);
    });
  });

  describe('delete tags', () => {
    it('should successfully delete specific tag', async () => {
      return request(app.getHttpServer())
        .delete('/tags/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);
    });
    it('should delete undefined tag without errors', async () => {
      return request(app.getHttpServer())
        .delete('/tags/99')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);
    });
  });
});
