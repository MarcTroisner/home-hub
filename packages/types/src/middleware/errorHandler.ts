/**
 * @file Contains types for express error handler middleware
 */

export interface IErrorResponder {
  sync: (identifier?: string | unknown, meta?: Record<string, any>) => void;
  async: (identifier?: string, meta?: Record<string, any>) => Promise<never>;
}
