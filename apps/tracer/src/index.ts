import type { AddressInfo } from 'net';

import express from 'express';
import cookieParser from 'cookie-parser';
import { connection, connect, set } from 'mongoose';
import { config } from 'dotenv';
import { json } from 'body-parser';
import { appLogger, httpLogger, errorLogger, createLoggerInstance } from '@package/middleware/logging';
import { errorHandler, responder } from '@package/middleware/error-handling';

import spanRouter from '@/routers/spanRouter';

config({ path: '.env.local', override: true });

const app = express();
const logger = createLoggerInstance();

/** Database setup */
set('strictQuery', false);

connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info('Connected to MongoDB', {
      connection: process.env.MONGO_URI,
    });
  })
  .catch((err) => {
    logger.error(err.message, {
      stack: err.stack,
      os: logger.exceptions.getOsInfo(),
      process: logger.exceptions.getProcessInfo(),
      trace: logger.exceptions.getTrace(err),
    });
  });

/** MongoDB events */
connection.on('disconnected', () => {
  logger.error('Lost connection to MongoDB, attempting to reconnect...');
});

connection.on('reconnected', () => {
  logger.info('Connection to MongoDB reestablished');
});

/** Register middleware */
app.use(json());
app.use(cookieParser());
app.use(appLogger);
app.use(httpLogger());
app.use(responder);

/** Register routes */
app.use('/spans', spanRouter);

/** Register error handlers */
app.use(errorLogger);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 8002, () => {
  logger.info('App startup complete', { port: (server.address() as AddressInfo).port });
});
