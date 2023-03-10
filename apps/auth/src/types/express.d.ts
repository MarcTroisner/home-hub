import type { Logger } from 'winston';
import type { IErrorResponder } from '@package/middleware/error-handling';

declare module 'express-serve-static-core' {
  interface Application {
    logger: Logger;
    responder: IErrorResponder;
  }
}
