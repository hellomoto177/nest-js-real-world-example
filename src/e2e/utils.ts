import { createConnection } from 'typeorm';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/user/user.dto';

if (process.env.NODE_ENV !== 'test')
  throw new Error("Using NODE_ENV other than 'test' is DAMNED DANGEROUS!");

export default class TestingTools {
  /**
   * Create Application instance
   */
  static async createApp() {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication();
    await app.useGlobalPipes(new ValidationPipe()).init();

    return app;
  }

  /**
   * Registers new user and returns token
   */
  static async register(user?: CreateUserDTO) {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    let account: CreateUserDTO;

    if (!user) {
      account = {
        email: 'username@host.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
    } else {
      account = user;
    }

    let token: string;

    const app = await module.createNestApplication();
    await app.useGlobalPipes(new ValidationPipe()).init();
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(account)
      .expect(({ body }) => {
        ({ token } = body);
      });
    await app.close();

    return token;
  }

  /**
   * Drop database where we are
   */
  static async dropDatabase() {
    const connection = await createConnection();
    try {
      await connection.dropDatabase();
    } catch (error) {
      throw new Error(
        `ERROR. Something went wrong while deleting database: ${error}`,
      );
    } finally {
      await connection.close();
    }
  }

  /**
   * Insert the data from the fixtures folder
   */
  static async loadFixtures(entities: any[]) {
    const connection = await createConnection();
    try {
      for (const entity of entities) {
        const fixtureFile = path.join(
          __dirname,
          `/fixtures/${entity.name}.json`,
        );
        if (entity.name.includes('Relation')) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
          const promises = items.map((rel: any) => {
            const entityName = entity.name.split('-')[0];
            const relationName = entity.name.split('-')[1].toLowerCase();
            return connection
              .createQueryBuilder()
              .relation(entityName, relationName)
              .of(rel.source)
              .add(rel.target);
          });
          await Promise.all(promises);
        } else {
          const repository = await connection.getRepository(entity.name);
          if (fs.existsSync(fixtureFile)) {
            const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
            await repository
              .createQueryBuilder(entity.name)
              .insert()
              .values(items)
              .execute();
          }
        }
      }
      await connection.close();
    } catch (error) {
      throw new Error(
        `ERROR. Something went wrong while loading fixtures on test db: ${error}`,
      );
    } finally {
      connection.isConnected && (await connection.close());
    }
  }
}
