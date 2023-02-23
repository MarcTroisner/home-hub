import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { createLogger, transports, format, Logger } from 'winston';
import morgan from 'morgan';
import 'winston-daily-rotate-file';

const { combine, json, timestamp, prettyPrint, metadata } = format;

const LOG_LEVELS: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  trace: 5,
};

/**
 * Creates a usable app-logger instance
 *
 * @returns {Logger} Configured app logger
 */
export function createAppLoggerInstance(): Logger {
  return createLogger({
    levels: LOG_LEVELS,
    level: 'trace',
    defaultMeta: (process.env.SERVICE_NAME) ? { service: process.env.SERVICE_NAME } : undefined,
    format: combine(
      timestamp(),
      json(),
      metadata({ key: 'metadata' }),
    ),
    transports: [
      new transports.Console({ format: prettyPrint() }),
      new transports.DailyRotateFile({
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        dirname: 'logs',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
}

/**
 * Registers an HTTP-logger which logs every incoming request
 *
 * Requests are logged to:
 * - The console as prettified JSON
 * - A file called http-{DATE}.log
 *
 * @returns {RequestHandler} HTTP-logger middleware
 */
export function httpLogger(): RequestHandler {
  const httpLoggerInstance = createLogger({
    levels: LOG_LEVELS,
    level: 'http',
    defaultMeta: (process.env.SERVICE_NAME) ? { service: process.env.SERVICE_NAME } : undefined,
    format: combine(
      timestamp(),
      json(),
      metadata({ key: 'metadata' }),
    ),
    transports: [
      new transports.Console({ format: prettyPrint() }),
      new transports.DailyRotateFile({
        filename: 'http-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        dirname: 'logs',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });

  return morgan(
    (tokens, req, res) => JSON.stringify({
      remoteAddress: tokens['remote-addr'](req, res),
      remoteUser: tokens['remote-user'](req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      httpVersion: `HTTP/${tokens['http-version'](req, res)}`,
      status: tokens.status(req, res),
      contentLength: tokens.res(req, res, 'content-length'),
      referrer: tokens.referrer(req, res),
      userAgent: tokens['user-agent'](req, res),
      responseTime: `${tokens['response-time'](req, res)} ms`,
    }),
    {
      stream: {
        write: (message) => { httpLoggerInstance.http('Incoming request', JSON.parse(message)); },
      },
    },
  );
}

/**
 * Registers an app-logger which will be available everywhere from req.app.logger
 *
 * Requests are logged to:
 * - The console as prettified JSON
 * - A file called app-{DATE}.log
 *
 * @param {Request} req - Request object
 * @param {Response} _res - Response object
 * @param {NextFunction} next - Next function
 */
export function appLogger(req: Request, _res: Response, next: NextFunction): void {
  const appLoggerInstance = createAppLoggerInstance();

  req.app.logger = appLoggerInstance;

  next();
}
