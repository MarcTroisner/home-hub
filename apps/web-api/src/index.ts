import type { Request, Response } from 'express';

import express from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import {
  httpLogger,
  appLogger,
  errorHandler,
  errorLogger,
} from '@package/middleware';

const app = express();

app.use(json());
app.use(cookieParser());
app.use(httpLogger());
app.use(appLogger);

app.get('/:id?', (req: Request, res: Response): void => {
  res.send({
    root: 'web-api',
    body: req.body,
    cookies: req.cookies,
    query: req.query,
    headers: req.headers,
  });
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(8000, (): void => {
  console.log(`App listening on port ${8000}`);
});
