import type { Request, Response, NextFunction } from 'express';

import { AppError } from './appError';

/**
 * Global error handler
 *
 * If the received error is an instance of AppError, the error is converted to a response. If the error is any other error, a new
 * instance of AppError (with a 500 status code) is created and converted to a response.
 *
 * @param {unknown} err - Error passed to middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const error = (err instanceof AppError) ? err : new AppError({ identifier: 'APP-0001' });

  // if (error.getStatus() >= 500)

  res.status(error.getStatus()).send(error.getResponse());
}
