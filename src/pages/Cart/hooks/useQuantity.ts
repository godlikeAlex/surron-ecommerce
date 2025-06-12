import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { MyCartUpdateAction } from '@commercetools/platform-sdk';
import { useMutation } from '@tanstack/react-query';

export const useQuantity = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const cartId = useApiRootStore((state) => state.cartId);
  const cartVersion = useApiRootStore((state) => state.cartVersion);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (actions: MyCartUpdateAction[]) => {
      const response = await apiRoot
        .me()
        .carts()
        .withId({ ID: cartId ?? '' })
        .post({
          body: {
            actions,
            version: cartVersion,
          },
        })
        .execute();
      apiRootStore().setCartVersion(response.body.version);
    },
  });

  return { isPending, mutateAsync };
};
