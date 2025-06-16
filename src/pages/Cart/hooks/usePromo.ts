import { useApiRootStore } from '@/store/apiRootStore';
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from '@tanstack/react-query';

export const usePromo = (
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Cart[], Error>>
) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      actions,
      cartId,
      cartVersion,
    }: {
      actions: CartUpdateAction[];
      cartId: string;
      cartVersion: number;
    }) => {
      await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            actions,
            version: cartVersion,
          },
        })
        .execute();
    },
    onSuccess: async () => {
      await refetch();
    },
  });

  return { isPending, mutateAsync };
};
