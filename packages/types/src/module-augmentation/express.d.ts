import type { Logger } from 'winston';

import type { IErrorResponder } from '../middleware/errorHandler';

/**
 * @file Contains module-augmentation types for express applications
 */

export interface IExpressApplication {
  logger: Logger;
  responder: IErrorResponder;
}
