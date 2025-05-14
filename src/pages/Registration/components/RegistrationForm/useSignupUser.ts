import { useMutation } from '@tanstack/react-query';
import { FormValues } from './RegistrationForm';
import { useApiRootStore } from '@/store/apiRootStore';

import { getCommercetoolsErrors } from '@/utils/errors/getCommercetoolsErrorMessage';
import { ServerErrorValidation } from '@/errors/ServerErrorValidation';
import { ClientResponse } from '@commercetools/ts-client';
import { CustomerSignInResult } from '@commercetools/platform-sdk';

export const useSignupUser = () => {
  const { apiRoot } = useApiRootStore();

  const { isPending, error, isError, mutateAsync } = useMutation<
    ClientResponse<CustomerSignInResult>,
    ServerErrorValidation,
    FormValues
  >({
    mutationFn: async (values) => {
      try {
        const result = await apiRoot
          .me()
          .signup()
          .post({ body: values })
          .execute();

        return result;
      } catch (error: unknown) {
        const translatedErrors = getCommercetoolsErrors(error);

        throw new ServerErrorValidation(translatedErrors);
      }
    },
  });

  return { isPending, error: isError && error, handleSignup: mutateAsync };
};
