import type { Request, Response } from 'express';
import type { AddressInfo } from 'net';

import express from 'express';
import { config } from 'dotenv';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { appLogger, httpLogger, createAppLoggerInstance } from '@package/middleware/logging';
import { errorHandler, errorLogger, responder } from '@package/middleware/error-handling';

config();

const app = express();
const logger = createAppLoggerInstance();

/** Register middleware */
app.use(json());
app.use(cookieParser());
app.use(appLogger);
app.use(httpLogger());
app.use(responder);

app.get('/', (_req: Request, res: Response): void => {
  res.send({ root: 'tracer-api' });
});

/** Register error handlers */
app.use(errorLogger);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 8002, () => {
  logger.info('App startup complete', { port: (server.address() as AddressInfo).port });
});
