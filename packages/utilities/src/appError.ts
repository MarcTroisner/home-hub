import { toUpper } from 'lodash';

/**
 * AppError constructor object
 *
 * @see AppError
 */
interface IAppError {
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
    'APP-0001': {
      detail: 'Internal server error.',
      status: 500,
    },
  };

  /** @property {string} identifier - Unique error identifier */
  identifier: string;
  /** @property {Record<string, any>} meta - Metadata object */
  meta: Record<string, any>;

  constructor({ identifier, meta = {} }: IAppError) {
    super();

    this.identifier = this.$_setErrorIdentifier(identifier);

    this.meta = meta;
    this.name = this.identifier;
    this.message = this.identifier;

    Error.captureStackTrace(this, AppError);
  }

  /**
   * Checks if the provided identifier is valid and returns an error identifier accordingly
   *
   * @param {string} identifier - Identifier provided to constructor
   * @returns {string} The identifier, if valid, otherwise 'APP-0001'
   */
  $_setErrorIdentifier(identifier: string): string {
    const transformedIdentifier = toUpper(identifier);

    return (Object.keys(this.$_errors).includes(transformedIdentifier)) ? transformedIdentifier : 'APP-0001';
  }

  /**
   * Generates a response object containing information about the error
   *
   * @returns {IAppErrorResponse} Error response object
   */
  getErrorResponse(): IAppErrorResponse {
    const errorInformation = this.$_errors[this.identifier];

    return {
      error: this.identifier,
      meta: this.meta,
      ...errorInformation,
    };
  }
}
