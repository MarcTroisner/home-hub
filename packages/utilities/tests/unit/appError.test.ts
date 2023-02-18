import { describe, expect, it } from 'vitest';
import { AppError } from '@/appError';

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

describe('AppError', () => {
  it('Initializes instance with valid identifier', () => {
    const instance = new AppError({ identifier: testData.identifiers.valid });

    expect(instance.identifier).toBe(testData.identifiers.valid);
    expect(instance.name).toBe(testData.identifiers.valid);
    expect(instance.message).toBe(testData.errorObjects.valid.detail);
  });

  it('Replaces identifier with APP-0001 if invalid', () => {
    const instance = new AppError({ identifier: testData.identifiers.invalid });

    expect(instance.identifier).toBe(testData.identifiers.fallback);
    // expect(instance.name).toBe(testData.identifiers.fallback);
    expect(instance.message).toBe(testData.errorObjects.fallback.detail);
  });

  it('Creates error response containing identifier, error object and metadata object', () => {
    const instance = new AppError({
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
