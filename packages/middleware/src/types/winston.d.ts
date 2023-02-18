import type { LeveledLogMethod } from 'winston';

export interface IWinstonAugmentation {
  trace: LeveledLogMethod;
}

declare module 'winston' {
  interface Logger extends IWinstonAugmentation {}
}
