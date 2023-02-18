import type { IExpressAugmentation } from '@package/types';

declare module 'express-serve-static-core' {
  interface Application extends IExpressAugmentation {}
}
