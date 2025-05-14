import { useMutation } from '@tanstack/react-query';
import { FormValues } from './RegistrationForm';
import { useApiRootStore } from '@/store/apiRootStore';

import { getCommercetoolsErrors } from '@/utils/errors/getCommercetoolsErrorMessage';
import { ServerErrorValidation } from '@/errors/ServerErrorValidation';
import { ClientResponse } from '@commercetools/ts-client';
import {
  CustomerDraft,
  CustomerSignInResult,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';

export const useSignupUser = () => {
  const { apiRoot } = useApiRootStore();

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

        const customerDraft: CustomerDraft = {
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
        };

        const result = await apiRoot
          .me()
          .signup()
          .post({
            // Known type bug, billing and shipping addresses are missing during registration,
            // but they are still registered so I had to use this trick with types
            body: customerDraft as MyCustomerDraft,
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
