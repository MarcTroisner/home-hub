import Joi from 'joi';
import { ESpanKind, EStatusCodes } from '@package/models';

export const spanValidator = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid(...Object.values(ESpanKind)).required(),
  context: Joi.object({
    traceId: Joi.string().required(),
    spanId: Joi.string().required(),
  }).required(),
  parentId: Joi.string().allow(null).required(),
  statusCode: Joi.string().valid(...Object.values(EStatusCodes)).required(),
  statusMessage: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  attributes: Joi.object().unknown(true).required(),
  events: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    timestamp: Joi.date().required(),
    attributes: Joi.object().unknown(true).required(),
  })).required(),
});
