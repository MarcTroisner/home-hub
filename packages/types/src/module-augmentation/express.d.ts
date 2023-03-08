import type { Logger } from 'winston';
import type { IErrorResponder } from '../middleware/errorHandler';
import type { ITracer } from '../middleware/tracer';

/**
 * @file Contains module-augmentation types for express applications
 */

export interface IExpressApplication {
  logger: Logger;
  responder: IErrorResponder;
  tracer: ITracer;
}
