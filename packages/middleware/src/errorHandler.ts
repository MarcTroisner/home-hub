/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from 'express';

import { createLogger, format, transports } from 'winston';
import { AppError } from './appError';

const { timestamp, json, combine, prettyPrint, metadata } = format;

/**
 * Error logger
 *
 * Logs app errors to console and log files
 *
 * @param {unknown} err - Error passed to middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction): void {
  const logger = createLogger({
    level: 'error',
    defaultMeta: (process.env.SERVICE_NAME) ? { service: process.env.SERVICE_NAME } : undefined,
    format: combine(
      timestamp(),
      json(),
      metadata({ key: 'metadata' }),
    ),
    transports: [
      new transports.Console({ format: prettyPrint() }),
      new transports.DailyRotateFile({
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        dirname: 'logs',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });

  logger.error(err.message, {
    stack: err.stack,
    os: logger.exceptions.getOsInfo(),
    process: logger.exceptions.getProcessInfo(),
    trace: logger.exceptions.getTrace(err),
  });

  next(err);
}

/**
 * Error handler
 *
 * If the received error is an instance of AppError, the error is converted to a response. If the error is any other error, a new
 * instance of AppError (with a 500 status code) is created and converted to a response.
 *
 * @param {unknown} err - Error passed to middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const error = (err instanceof AppError) ? err : new AppError({ identifier: 'APP-0001' });

  res.status(error.getStatus()).send(error.getResponse());
}
