import type { AddressInfo } from 'net';

import express from 'express';
import cookieParser from 'cookie-parser';
import { connection, connect, set } from 'mongoose';
import { config } from 'dotenv';
import { json } from 'body-parser';
import { appLogger, httpLogger, errorLogger, createLoggerInstance } from '@package/middleware/logging';
import { tracer } from '@package/middleware/tracing';
import { errorHandler, responder } from '@package/middleware/error-handling';

config({ path: '.env.local', override: true });

const app = express();
const errLogger = createLoggerInstance({ level: 'error', filename: 'error' });
const logger = createLoggerInstance({ level: 'trace', filename: 'app' });

/** Database setup */
set('strictQuery', false);

connect(process.env.MONGO_URI as string, { user: 'root', pass: 'example', authSource: 'admin' })
  .then(() => {
    logger.info('Connected to MongoDB', {
      connection: process.env.MONGO_URI,
    });
  })
  .catch((err) => {
    errLogger.error(err.message, {
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
app.use(tracer);

/** Register routes */
app.get('/', (req, res) => {
  req.app.tracer
    .start()
    .addSpanEvent({ mapping: 'root', event: { name: 'Some event', attributes: { foo: 'bar' } } })
    .addSpanAttribute({ mapping: 'root', attributes: { some: 'attr' } })
    .finishSpan({ mapping: 'root' });

  res.sendStatus(200);
});

/** Register error handlers */
app.use(errorLogger);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 8000, () => {
  logger.info('App startup complete', { port: (server.address() as AddressInfo).port });
});
