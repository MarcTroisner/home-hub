import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ObjectSchema } from 'joi';

import { isSchema } from 'joi';
import { pick, map } from 'lodash';
import { AppError } from './appError';

/**
 * Validates the request body
 *
 * Performs a validation on the request body with the given Joi schema. If the validation fails, a validation AppError passed to the next
 * function. If the provided schema is not a valid Joi schema, a AppError with a status code 500 is thrown. If the validation is
 * successful, the request body is replaced with the validated data. Keys unknown to the schema are omitted.
 *
 * @param schema - Joi schema representing validation schema
 * @returns Request handler performing validation
 */
export function bodyValidator(schema: ObjectSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!isSchema(schema)) return next(new AppError({ identifier: 'APP-0001' }));

    const validationSchema = schema.options({ allowUnknown: true, stripUnknown: true });

    const { error, value } = validationSchema.validate(req.body);

    if (error) {
      const meta = map(error.details, (detail) => pick(detail, ['message', 'path', 'context']));
      return next(new AppError({ identifier: 'VALO-0001', meta }));
    }

    req.body = value;

    next();
  };
}

/**
 * Validates request query
 *
 * Performs a validation on the request query object with the given Joi schema. If the validation fails, a validation AppError passed
 * to the next function. If the provided schema is not a valid Joi schema, a AppError with a status code 500 is thrown. If the validation is
 * successful, the request query is replaced with the validated data. Keys unknown to the schema are omitted.
 *
 * @param schema - Joi schema representing validation schema
 * @returns Request handler performing validation
 */
export function queryValidator(schema: ObjectSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!isSchema(schema)) return next(new AppError({ identifier: 'APP-0001' }));

    const validationSchema = schema.options({ allowUnknown: true, stripUnknown: true });

    const { error, value } = validationSchema.validate(req.query);

    if (error) {
      const meta = map(error.details, (detail) => pick(detail, ['message', 'path', 'context']));
      return next(new AppError({ identifier: 'VALO-0001', meta }));
    }

    req.query = value;

    next();
  };
}

/**
 * Validates request headers
 *
 * Performs a validation on the request headers object with the given Joi schema. If the validation fails, a validation AppError passed
 * to the next function. If the provided schema is not a valid Joi schema, a AppError with a status code 500 is thrown.
 *
 * @param schema - Joi schema representing validation schema
 * @returns Request handler performing validation
 */
export function headerValidator(schema: ObjectSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!isSchema(schema)) return next(new AppError({ identifier: 'APP-0001' }));

    const validationSchema = schema.options({ allowUnknown: true });

    const { error, value } = validationSchema.validate(req.headers);

    if (error) {
      const meta = map(error.details, (detail) => pick(detail, ['message', 'path', 'context']));
      return next(new AppError({ identifier: 'VALO-0001', meta }));
    }

    req.headers = value;

    next();
  };
}

/**
 * Validates request cookies
 *
 * Performs a validation on the request cookies object with the given Joi schema. If the validation fails, a validation AppError passed
 * to the next function. If the provided schema is not a valid Joi schema, a AppError with a status code 500 is thrown.
 *
 * @param schema - Joi schema representing validation schema
 * @returns Request handler performing validation
 */
export function cookieValidator(schema: ObjectSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!isSchema(schema)) return next(new AppError({ identifier: 'APP-0001' }));

    const validationSchema = schema.options({ allowUnknown: true });

    const { error, value } = validationSchema.validate(req.cookies);

    if (error) {
      const meta = map(error.details, (detail) => pick(detail, ['message', 'path', 'context']));
      return next(new AppError({ identifier: 'VALO-0001', meta }));
    }

    req.cookies = value;

    next();
  };
}
