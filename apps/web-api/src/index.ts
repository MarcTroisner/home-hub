import type { Request, Response } from 'express';

import Joi from 'joi';
import express from 'express';
import { json } from 'body-parser';
import { httpLogger, appLogger, bodyValidator } from '@package/middleware';

const app = express();

app.use(json());
app.use(httpLogger());
app.use(appLogger);

const schema = Joi.object({
  foo: Joi.string().required(),
  bar: Joi.number().min(10).max(20),
});

app.get('/', bodyValidator(schema), (req: Request, res: Response): void => {
  res.send({ root: 'web-api', body: req.body });
});

app.listen(8000, (): void => {
  console.log(`App listening on port ${8000}`);
});
