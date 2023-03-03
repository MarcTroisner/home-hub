import type { LeveledLogMethod } from 'winston';

/**
 * @file Contains module-augmentation types for winston logging
 */

export interface IWinstonLogger {
  trace: LeveledLogMethod;
}
