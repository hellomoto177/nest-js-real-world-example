import { createConnection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ValidationPipe } from '@nestjs/common';

export default class TestUtils {
  static async startApplication() {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication();
    await app.useGlobalPipes(new ValidationPipe()).init();

    return app;
  }

  static async dropDatabase() {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.close();
  }

  /**
   * Insert the data from the fixtures folder
   */
  static async loadFixtures(entities: any[]) {
    try {
      const connection = await createConnection();
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
      connection.close();
    } catch (error) {
      throw new Error(
        `ERROR [TestUtils.loadFixtures()]: Loading fixtures on test db: ${error}`,
      );
    }
  }
}
