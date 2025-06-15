import { useMutation } from '@tanstack/react-query';
import { withActiveCart } from '../queries/useActiveCart';
import { useApiRootStore } from '@/store/apiRootStore';
import { CartUpdateAction } from '@commercetools/platform-sdk';

export const useCartAction = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  return useMutation({
    mutationFn: (action: CartUpdateAction) => {
      return withActiveCart(apiRoot)(async ({ cartID, cartVersion }) => {
        const response = await apiRoot
          .carts()
          .withId({ ID: cartID })
          .post({
            body: {
              version: cartVersion,
              actions: [action],
            },
          })
          .execute();

        return response.body;
      });
    },
  });
};
