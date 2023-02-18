import type { LeveledLogMethod } from 'winston';

export interface IWinstonAugmentation {
  trace: LeveledLogMethod;
}
