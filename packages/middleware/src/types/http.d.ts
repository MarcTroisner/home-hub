import type { IHttpIncomingHttpHeaders } from '@package/types/module-augmentation';

declare module 'http' {
  interface IncomingHttpHeaders extends IHttpIncomingHttpHeaders {}
}
