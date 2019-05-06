import { createConnection, ConnectionOptions } from 'typeorm';
import { Feedback } from '../modules/feedback/feedback.entity';

const opts: ConnectionOptions = {
  migrationsRun: true,
  migrations: [__dirname + '/../src/migrations/*.ts'],
  type: 'postgres',
  host: 'localhost',
  port: 5442,
  username: 'user',
  password: 'password',
  database: 'english_test',
  entities: [__dirname + '/../src/**/*.entity.ts'],
  synchronize: false,
};

createConnection(opts)
  .then(async connection => {
    let feedback = new Feedback();
    feedback.authorName = 'Me and Bears';
    feedback.authorDescription = 'I am near polar bears';
    feedback.text = 'photo-with-bears.jpg';
    feedback.isPublished = true;
    // const queryRunner = connection.createQueryRunner();
    // console.log('migrations:', connection.migrations);
    // const res = await connection.runMigrations();
    // await queryRunner.clearDatabase();
    const res = await connection.manager.save(feedback);
    // console.log('res:', res);
    // console.log('run migrations');
    const queryRunner = connection.createQueryRunner();
    await queryRunner// console.log('hasTable:', hasTable); // console.log('hasDatabase:', hasDatabase); // let hasTable = await queryRunner.hasTable('migrations'); // let hasDatabase = await queryRunner.hasDatabase('english_test');
    // await connection.runMigrations();
    .console
      .log('Feedback has been saved. Photo id is', res.id);
  })
  .catch(error => console.log('Connection error:', error));
