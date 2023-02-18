import type { IExpressAugmentation } from '@package/middleware';

declare module 'express-serve-static-core' {
  interface Application extends IExpressAugmentation {}
}
