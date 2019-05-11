import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Note } from '../modules/note/note.entity';
import { Group } from '../modules/group/group.entity';
import { CreateNoteDTO } from 'src/modules/note/dto/create-note.dto';

describe('Group API', () => {
  let app: INestApplication;

  beforeAll(async done => {
    await testingTools.dropDatabase();
    await testingTools.loadFixtures([Group]);
    await testingTools.loadFixtures([Note]);

    app = await testingTools.createApp();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe('get notes', () => {
    it('should successfully get all notes', async () => {
      return request(app.getHttpServer())
        .get('/notes')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.length).toEqual(6);
          body.forEach((note: Note) => {
            expect(note).toHaveProperty('id');
            expect(note.group).toBeUndefined();
          });
        });
    });

    it('should successfully get all notes with groups', async () => {
      return request(app.getHttpServer())
        .get('/notes?expand=group')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.length).toEqual(6);
          body.forEach((note: Note) => {
            expect(note.group).toHaveProperty('id');
          });
        });
    });
    it('should successfully get specific note by id', async () => {
      return request(app.getHttpServer())
        .get('/notes/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('group');
          expect(body.group).toHaveProperty('id');
        });
    });
  });

  describe('create notes', () => {
    it('should successfully create new note', async () => {
      const dto: CreateNoteDTO = {
        title: 'typical testing note',
        content: 'Lorem ipsum dolor',
        groupId: 1,
      };

      return request(app.getHttpServer())
        .post('/notes')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('title');
          expect(body).toHaveProperty('content');
          expect(body).toHaveProperty('groupId');
        });
    });
    it('should validate note with undefined group', async () => {
      const dto = {
        title: 'typical testing note',
        content: 'Lorem ipsum dolor',
      };

      return request(app.getHttpServer())
        .post('/notes')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body).toHaveProperty('message');
          expect(body.message).toHaveLength(1);
          expect(body.message[0].constraints).toHaveProperty('isDefined');
          expect(body.message[0].constraints.isDefined).toContain('groupId');
        });
    });
  });

  // describe('update notes', () => {
  //   it('should successfully update specific note', async () => {});
  // });

  // describe('delete groups', () => {
  //   it('should successfully delete specific note', async () => {});
  //   it('should delete undefined group without errors', async () => {});
  // });
});
