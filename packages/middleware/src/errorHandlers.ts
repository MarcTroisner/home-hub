/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from 'express';
import type { IErrorResponder } from '@package/types';

import { createLogger, format, transports } from 'winston';
import { AppError } from './appError';

const { timestamp, json, combine, prettyPrint, metadata } = format;

/**
 * Error logger
 *
 * Logs app errors to console and log files
 *
 * @param {Error} err - Error passed to middleware
 * @param {Request} _req - Request object
 * @param {Response} _res - Response object
 * @param {NextFunction} next - Next function
 */
export function errorLogger(err: Error, _req: Request, _res: Response, next: NextFunction): void {
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
 * @param {Error} err - Error passed to middleware
 * @param {Request} _req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} _next - Next function
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const error = (err instanceof AppError) ? err : new AppError({ identifier: 'APP-0001' });

  res.status(error.getStatus()).send(error.getResponse());
}

/**
 * Error responder
 *
 * Responder middleware for invoking exceptions or promise rejections. Accessible via req.app.responder.
 *
 * @param {Request} _req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} _next - Next function
 */
export function responder(req: Request, _res: Response, next: NextFunction): void {
  req.app.responder = {
    /**
     * Synchronous error responder
     *
     * Can be used to invoke an error inside synchronous code blocks.
     *
     * @param {string} identifier - App error identifier
     * @param {Record<string, any>} meta - Optional meta data
     */
    sync(identifier: string, meta?: Record<string, any>): void {
      const error = new AppError({ identifier, meta });

      next(error);
    },
    /**
     * Asynchronous error responder
     *
     * Can be used to invoke an error inside a asynchronous code block. Has to be caught afterwards and pass on to the error handler or the
     * sync method.
     *
     * @param {string} identifier - App error identifier
     * @param {Record<string, any>} meta - Optional meta data
     * @returns {Promise<never>} A rejected promise
     */
    async(identifier: string, meta?: Record<string, any>): Promise<never> {
      const error = new AppError({ identifier, meta });

      return Promise.reject(error);
    },
  };

  next();
}
