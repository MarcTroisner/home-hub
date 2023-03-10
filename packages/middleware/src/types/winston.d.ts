import type { LeveledLogMethod } from 'winston';

declare module 'winston' {
  interface Logger {
    trace: LeveledLogMethod;
  }
}
