import type { IWinstonLogger } from '@package/types/module-augmentation';

declare module 'winston' {
  interface Logger extends IWinstonLogger {}
}
