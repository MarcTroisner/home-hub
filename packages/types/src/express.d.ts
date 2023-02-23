import type { Logger } from 'winston';

export interface IErrorResponder {
  sync: (identifier: string, meta?: Record<string, any>) => void;
  async: (identifier: string, meta?: Record<string, any>) => Promise<never>;
}

export interface IExpressAugmentation {
  logger: Logger;
  responder: IErrorResponder;
}
