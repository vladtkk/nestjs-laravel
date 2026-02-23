import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().allow('').default('postgres'),
  DB_DATABASE: Joi.string().default('nestjs_db'),
  DB_SYNCHRONIZE: Joi.boolean().truthy('true').falsy('false').default(false),

  JWT_SECRET: Joi.string().min(16).default('superSecretKeyForDev'),
  JWT_EXPIRES_IN: Joi.alternatives(Joi.string(), Joi.number()).default('1h'),

  ARGON2_MEMORY_COST: Joi.number().integer().min(8192).default(65536),
  ARGON2_TIME_COST: Joi.number().integer().min(1).default(3),
  ARGON2_PARALLELISM: Joi.number().integer().min(1).default(4),

  CORS_ORIGINS: Joi.string().default('*'),
  THROTTLER_TTL: Joi.number().integer().default(60),
  THROTTLER_LIMIT: Joi.number().integer().default(10),
});
