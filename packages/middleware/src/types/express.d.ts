import type { Logger } from 'winston';

export interface IExpressAugmentation {
  logger: Logger;
}

declare module 'express-serve-static-core' {
  interface Application extends IExpressAugmentation {}
}
