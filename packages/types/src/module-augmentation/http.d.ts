/**
 * @file Contains module-augmentation types for http library for express applications
 */

export interface IHttpIncomingHttpHeaders {
  'trace-id'?: string;
  'span-id'?: string;
}
