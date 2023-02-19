import { toUpper } from 'lodash';

/**
 * AppError constructor object
 *
 * @see AppError
 */
export interface IAppError {
  identifier: string;
  meta?: Record<string, any>;
}

/** Unique error object */
interface IAppErrorObject {
  /** Short, human-readably description of the error */
  detail: string;
  /** Status code associated with error */
  status: number;
}

export interface IAppErrorResponse extends IAppErrorObject {
  error: string;
  meta: Record<string, any>;
}

/**
 * AppError class used to handle errors in the application
 *
 * @class
 * @public
 *
 * @param {string} identifier - Unique error identifier. If invalid, falls back to APP-0001, which is the equivalent to an internal
 * server error
 * @param {Record<string, any>} [meta] - Metadata object
 */
export class AppError extends Error {
  /**
   * @property {Record<string, IAppErrorObject>} $_errors - Collection of available errors, where the key is the unique identifier
   * for the error
   * @private
   */
  $_errors: Record<string, IAppErrorObject> = {
    'TEST-0001': {
      detail: 'Refuses the attempt to brew coffee with a teapot.',
      status: 418,
    },
    'APP-0001': {
      detail: 'Internal server error.',
      status: 500,
    },
    'VALO-0001': {
      detail: 'Request validation failed.',
      status: 422,
    },
  };

  /** @property {string} identifier - Unique error identifier */
  identifier: string;
  /** @property {Record<string, any>} meta - Metadata object */
  meta: Record<string, any>;

  constructor({ identifier, meta = {} }: IAppError) {
    super();

    const transformedIdentifier = toUpper(identifier);

    this.identifier = (Object.keys(this.$_errors).includes(transformedIdentifier)) ? transformedIdentifier : 'APP-0001';

    this.meta = meta;
    this.name = this.identifier;
    this.message = this.$_errors[this.identifier].detail;

    Error.captureStackTrace(this, AppError);
  }

  /**
   * Generates a response object containing information about the error
   *
   * @returns {IAppErrorResponse} Error response object
   */
  getResponse(): IAppErrorResponse {
    return {
      error: this.identifier,
      meta: this.meta,
      ...this.$_errors[this.identifier],
    };
  }

  /**
   * Returns the status code for the current instance
   *
   * @returns {number} Error status
   */
  getStatus(): number {
    return this.$_errors[this.identifier].status;
  }
}
