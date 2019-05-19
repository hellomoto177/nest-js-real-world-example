import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test'])
        .default('development'),
      PORT: Joi.number().default(3000),
      AUTH_TOKEN_EXPIRES: Joi.number().default(3600),
      AUTH_SECRET: Joi.string().default('ItIsNotASecret'),

      // TODO: use it in app.module to configure database connection
      DB_USER: Joi.string(),
      DB_PASSWORD: Joi.string(),
      DB_NAME: Joi.string(),
      DB_HOST: Joi.string(),
      DB_PORT: Joi.number(),
      DB_MIGRATIONS_RUN: Joi.boolean().default(false),

      TEST_DB_USER: Joi.string(),
      TEST_DB_PASSWORD: Joi.string(),
      TEST_DB_NAME: Joi.string(),
      TEST_DB_HOST: Joi.string(),
      TEST_DB_PORT: Joi.number(),
      TEST_DB_MIGRATIONS_RUN: Joi.boolean().default(false),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get authTokenExpires(): number {
    return Number(this.envConfig.AUTH_TOKEN_EXPIRES);
  }

  get authSecret(): string {
    return this.envConfig.AUTH_SECRET;
  }

  get dbUser(): string {
    return process.env.NODE_ENV === 'test'
      ? this.envConfig.TEST_DB_USER
      : this.envConfig.DB_USER;
  }

  get dbPassword(): string {
    return process.env.NODE_ENV === 'test'
      ? this.envConfig.TEST_DB_PASSWORD
      : this.envConfig.DB_PASSWORD;
  }

  get dbName(): string {
    return process.env.NODE_ENV === 'test'
      ? this.envConfig.TEST_DB_NAME
      : this.envConfig.DB_NAME;
  }

  get dbHost(): string {
    return process.env.NODE_ENV === 'test'
      ? this.envConfig.TEST_DB_HOST
      : this.envConfig.DB_HOST;
  }

  get dbPort(): number {
    return Number(
      process.env.NODE_ENV === 'test'
        ? this.envConfig.TEST_DB_PORT
        : this.envConfig.DB_PORT,
    );
  }

  get dbMigrationsRun(): boolean {
    return Boolean(
      process.env.NODE_ENV === 'test'
        ? this.envConfig.TEST_DB_MIGRATIONS_RUN
        : this.envConfig.DB_MIGRATIONS_RUN,
    );
  }
}
