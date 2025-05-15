import { useMutation } from '@tanstack/react-query';
import { FormValues } from './RegistrationForm';
import { useApiRootStore } from '@/store/apiRootStore';

import { getCommercetoolsErrors } from '@/utils/errors/getCommercetoolsErrorMessage';
import { ServerErrorValidation } from '@/errors/ServerErrorValidation';
import { ClientResponse } from '@commercetools/ts-client';
import { CustomerSignInResult } from '@commercetools/platform-sdk';

export const useSignupUser = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { isPending, error, isError, mutateAsync } = useMutation<
    ClientResponse<CustomerSignInResult>,
    ServerErrorValidation,
    FormValues
  >({
    mutationFn: async (values) => {
      try {
        const addresses = [
          values.address,
          ...(!values.address.useAsBilling ? [values.billing] : []),
        ];

        const shippingAddressID = 0;
        const billingAddressID = values.address.useAsBilling ? 0 : 1;

        const result = await apiRoot
          .customers()
          .post({
            body: {
              ...values,
              addresses,
              billingAddresses: [billingAddressID],
              shippingAddresses: [shippingAddressID],
              defaultShippingAddress: values.address.useAsDefault
                ? shippingAddressID
                : undefined,
              defaultBillingAddress: values.billing.useAsDefault
                ? billingAddressID
                : undefined,
            },
          })
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
