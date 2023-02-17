import type { IAppError } from '../src/appError';

import { describe, expect, it } from 'vitest';
import { AppError } from '../src/appError';

const testData = {
  identifiers: {
    valid: 'TEST-0001',
    invalid: 'NON-EXISTING',
    fallback: 'APP-0001',
  },
  errorObjects: {
    valid: {
      detail: 'Refuses the attempt to brew coffee with a teapot.',
      status: 418,
    },
    fallback: {
      detail: 'Internal server error.',
      status: 500,
    },
  },
  meta: {
    suggestion: 'Let us never talk about the noodle incident ever again.',
    timestamp: 'On a horrible day.',
  },
};

/**
 * Adds test error object to AppError $_errors property
 *
 * @param {string} identifier - Error identifier
 * @param {Record<string, any>} [meta] - Metadata object
 */
function augmentErrorObject({ identifier, meta = {} }: IAppError): AppError {
  const { identifiers, errorObjects } = testData;

  const instance = new AppError({ identifier, meta });

  instance.$_errors[identifiers.valid] = errorObjects.valid;
  instance.identifier = instance.$_setErrorIdentifier(identifier);
  instance.name = instance.identifier;
  instance.message = instance.$_setErrorMessage();

  return instance;
}

describe('AppError', () => {
  it('Initializes instance with valid identifier', () => {
    const instance = augmentErrorObject({ identifier: testData.identifiers.valid });

    expect(instance.identifier).toBe(testData.identifiers.valid);
    expect(instance.name).toBe(testData.identifiers.valid);
    expect(instance.message).toBe(testData.errorObjects.valid.detail);
  });

  it('Replaces identifier with APP-0001 if invalid', () => {
    const instance = augmentErrorObject({ identifier: testData.identifiers.invalid });

    expect(instance.identifier).toBe(testData.identifiers.fallback);
    // expect(instance.name).toBe(testData.identifiers.fallback);
    expect(instance.message).toBe(testData.errorObjects.fallback.detail);
  });

  it('Creates error response containing identifier, error object and metadata object', () => {
    const instance = augmentErrorObject({
      identifier: testData.identifiers.valid,
      meta: testData.meta,
    });

    const responseObject = instance.getErrorResponse();

    expect(responseObject.detail).toBe(testData.errorObjects.valid.detail);
    expect(responseObject.status).toBe(testData.errorObjects.valid.status);
    expect(responseObject.error).toBe(testData.identifiers.valid);
    expect(responseObject.meta).toBe(testData.meta);
  });
});
