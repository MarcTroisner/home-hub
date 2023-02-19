import type { Request, Response } from 'express';

import Joi from 'joi';
import express from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { httpLogger, appLogger, bodyValidator, queryValidator, headerValidator, cookieValidator } from '@package/middleware';

const app = express();

app.use(json());
app.use(cookieParser());
app.use(httpLogger());
app.use(appLogger);

const schema = Joi.object({
  foo: Joi.string().required(),
  bar: Joi.number().min(10).max(20).optional(),
});

const validators = [
  bodyValidator(schema),
  queryValidator(schema),
  headerValidator(schema),
  cookieValidator(schema),
];

app.get('/:id?', validators, (req: Request, res: Response): void => {
  res.send({ root: 'web-api',
    body: req.body,
    cookies: req.cookies,
    query: req.query,
    headers: req.headers,
  });
});

app.listen(8000, (): void => {
  console.log(`App listening on port ${8000}`);
});
