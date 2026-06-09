import * as Joi from 'joi';

export const ConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'stage', 'prod').default('dev'),
  PORT: Joi.number().default(3000),
  HOST_REDIS: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
});
