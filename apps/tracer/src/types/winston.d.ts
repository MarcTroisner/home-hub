import type { IWinstonAugmentation } from '@package/types';

declare module 'winston' {
  interface Logger extends IWinstonAugmentation {}
}
