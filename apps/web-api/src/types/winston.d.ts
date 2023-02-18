import type { IWinstonAugmentation } from '@package/middleware';

declare module 'winston' {
  interface Logger extends IWinstonAugmentation {}
}
