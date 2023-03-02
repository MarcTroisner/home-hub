/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from 'express';

import { AppError } from './appError';

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
export function errorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void {
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
     * @param {string | Error} [identifier = 'APP-0001'] - App error identifier
     * @param {Record<string, any>} [meta = undefined] - Meta data
     */
    sync(identifier: string | unknown = 'APP-0001', meta?: Record<string, any>): void {
      if (identifier instanceof Error) return next(identifier);
      const error = (typeof identifier === 'string') ? new AppError({ identifier, meta }) : new AppError({ identifier: 'APP-0001' });

      next(error);
    },
    /**
     * Asynchronous error responder
     *
     * Can be used to invoke an error inside a asynchronous code block. Has to be caught afterwards and pass on to the error handler or the
     * sync method.
     *
     * @param {string} [identifier = 'APP-0001'] - App error identifier
     * @param {Record<string, any>} [meta = undefined] - Meta data
     * @returns {Promise<never>} A rejected promise
     */
    async(identifier: string = 'APP-0001', meta?: Record<string, any>): Promise<never> {
      const error = new AppError({ identifier, meta });

      return Promise.reject(error);
    },
  };

  next();
}
