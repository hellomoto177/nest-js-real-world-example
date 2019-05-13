import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { Note } from '../modules/note/note.entity';
import { Group } from '../modules/group/group.entity';
import { CreateNoteDTO } from '../modules/note/note.dto';
import { Tag } from '../modules/tag/tag.entity';

describe('Note API', () => {
  let app: INestApplication;

  beforeAll(async done => {
    await testingTools.dropDatabase();
    await testingTools.loadFixtures([Group]);
    await testingTools.loadFixtures([Note]);
    await testingTools.loadFixtures([Tag]);
    await testingTools.loadFixtures([{ name: 'Tag-Notes-Relation' }]);

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

    it('should successfully get all notes with tags', async () => {
      return request(app.getHttpServer())
        .get('/notes?expand=tags')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveLength(6);
          const hasTags = body.some((note: any) => note.tags.length > 0);
          expect(hasTags).toBeTruthy();
          body.forEach(note => {
            if (note.id === 2) {
              expect(note.tags).toHaveLength(2);
            }
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
        .get('/notes/2')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.id).toEqual(2);
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

  describe('update notes', () => {
    it('should successfully update specific note', async () => {
      const dto = {
        id: 1,
        title: 'Brand new title',
      };

      return request(app.getHttpServer())
        .put(`/notes/${dto.id}`)
        .send({ title: dto.title })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toEqual(dto.id);
          expect(body.title).toEqual(dto.title);
        });
    });
  });

  describe('delete groups', () => {
    it('should successfully delete specific note', async () => {
      return request(app.getHttpServer())
        .delete('/notes/1')
        .expect(HttpStatus.OK);
    });
    it('should delete undefined note without errors', async () => {
      return request(app.getHttpServer())
        .delete('/notes/99')
        .expect(HttpStatus.OK);
    });
  });

  describe('working with tags', () => {
    const tag1 = { name: 'added tag to note #1' };
    const tag2 = { name: 'added tag to note #2' };
    const tag3 = { name: 'added tag to note #3' };

    describe('add tags', () => {
      it('should add tag to note', async () => {
        return request(app.getHttpServer())
          .post('/notes/2/tag')
          .send(tag1)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            expect(body.id).toEqual(2);
            const hasTag = body.tags.some((tag: Tag) => tag.name === tag1.name);
            expect(hasTag).toBeTruthy();
          });
      });

      it('should add second tag to note', async () => {
        return request(app.getHttpServer())
          .post('/notes/2/tag')
          .send(tag2)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            expect(body.id).toEqual(2);
            const filteredTags = body.tags.filter(
              (tag: Tag) => tag.name === tag2.name || tag.name === tag1.name,
            );
            expect(filteredTags).toHaveLength(2);
          });
      });

      it('should add dublicate tag to note', async () => {
        await request(app.getHttpServer())
          .post('/notes/2/tag')
          .send(tag3)
          .expect(HttpStatus.CREATED);

        return request(app.getHttpServer())
          .post('/notes/2/tag')
          .send(tag3)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            expect(body.id).toEqual(2);
            const filteredTags = body.tags.filter(
              (tag: Tag) => tag.name === tag3.name,
            );
            expect(filteredTags).toHaveLength(1);
          });
      });
    });
    describe('delete tag from note', () => {
      it('should delete tag from note', async () => {
        await request(app.getHttpServer())
          .post('/notes/2/tag')
          .send(tag3)
          .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
          .get('/notes/2')
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(
              body.tags.some((tag: Tag) => tag.name === tag3.name),
            ).toBeTruthy();
          });

        return request(app.getHttpServer())
          .delete('/notes/2/tag')
          .send(tag3)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(
              body.tags.some((tag: Tag) => tag.name === tag3.name),
            ).toBeFalsy();
          });
      });
    });
  });
});
