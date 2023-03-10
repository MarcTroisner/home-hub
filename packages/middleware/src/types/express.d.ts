import type { Logger } from 'winston';
import type { IErrorResponder } from '../errorHandlers';

declare module 'express-serve-static-core' {
  interface Application {
    logger: Logger;
    responder: IErrorResponder;
  }
}
