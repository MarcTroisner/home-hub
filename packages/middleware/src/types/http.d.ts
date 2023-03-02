import type { IHttpAugmentation } from '@package/types';

declare module 'http' {
  interface IncomingHttpHeaders extends IHttpAugmentation {}
}
