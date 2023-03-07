import type { Request, Response, NextFunction } from 'express';

/**
 * Creates a tracer provider for creating new traces
 *
 * @param {Request} _req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} _next - Next function
 */
export function traceProvider(req: Request, res: Response, next: NextFunction): void {
  next();
}
