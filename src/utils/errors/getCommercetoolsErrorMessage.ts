import { COMMERCE_TOOLS_ERRORS } from '@/constants/errors/commerce-tools-errors';
import { isSDKErrorResponse } from '@/utils/guards/isCommercetoolsError';

export type TranslatedErrorResponse = {
  general: string;
  errors: Array<{ message: string; field?: string }>;
};

export const getCommercetoolsErrors = (
  error: unknown
): TranslatedErrorResponse => {
  if (!isSDKErrorResponse(error)) {
    return {
      general: 'Что-то пошло не так, пожалуйста попробуйте снова',
      errors: [],
    };
  }

  const errors = error.body?.errors || [];

  const translatedMessages = errors.map((error) => {
    const errorCode = error.code;
    const field = typeof error?.field === 'string' ? error.field : undefined;

    if (
      Object.prototype.hasOwnProperty.call(COMMERCE_TOOLS_ERRORS, errorCode)
    ) {
      const translator = COMMERCE_TOOLS_ERRORS[errorCode];

      return {
        message: translator({ field }),
        field,
      };
    }

    console.warn('Unhandled translation:', error);

    return {
      message: error.message,
      field,
    };
  });

  return {
    general:
      translatedMessages[0].message ??
      'Что-то пошло не так, пожалуйста попробуйте снова',
    errors: translatedMessages,
  };
};
