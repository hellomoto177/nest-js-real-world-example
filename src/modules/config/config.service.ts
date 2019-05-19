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

      TEST_DB_USER: Joi.string(),
      TEST_DB_PASSWORD: Joi.string(),
      TEST_DB_NAME: Joi.string(),
      TEST_DB_HOST: Joi.string(),
      TEST_DB_PORT: Joi.number(),
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

  get authTokenExpires(): string {
    return this.envConfig.AUTH_TOKEN_EXPIRES;
  }

  get authSecret(): string {
    return this.envConfig.AUTH_SECRET;
  }
}
