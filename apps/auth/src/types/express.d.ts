import type { IExpressApplication } from '@package/types/module-augmentation';

declare module 'express-serve-static-core' {
  interface Application extends IExpressApplication {}
}
