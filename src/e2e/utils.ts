import { createConnection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ValidationPipe } from '@nestjs/common';

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
      for (const entity of entities.sort((a, b) => a.order - b.order)) {
        const repository = await connection.getRepository(entity.name);
        const fixtureFile = path.join(
          __dirname,
          `/fixtures/${entity.name}.json`,
        );

        if (fs.existsSync(fixtureFile)) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
          const result = await repository
            .createQueryBuilder(entity.name)
            .insert()
            .values(items)
            .execute();
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
