import { ClientResponse } from '@commercetools/ts-client';
import { ErrorResponse } from '@commercetools/platform-sdk';

type SDKError = ClientResponse<ErrorResponse>;

export const isSDKErrorResponse = (error: unknown): error is SDKError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'method' in error &&
    'statusCode' in error &&
    'body' in error &&
    'error' in error &&
    typeof error.method === 'string'
  );
};
