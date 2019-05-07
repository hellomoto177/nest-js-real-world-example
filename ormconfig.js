require('dotenv/config');

const isTestEnv = process.env.NODE_ENV === 'test';
const databaseOpts = {
  type: 'postgres',
  username: isTestEnv ? process.env.TEST_DB_USER : process.env.DB_USER,
  password: isTestEnv ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  host: isTestEnv ? process.env.TEST_DB_HOST : process.env.DB_HOST,
  port: Number(isTestEnv ? process.env.TEST_DB_PORT : process.env.DB_PORT),
  database: isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrationsRun: isTestEnv,
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
};

module.exports = databaseOpts;
