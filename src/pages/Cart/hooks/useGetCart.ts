import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';

export const useGetCart = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const cartId = useApiRootStore((state) => state.cartId);
  const cartVersion = useApiRootStore((state) => state.cartVersion);

  const { data, isPending } = useQuery({
    queryKey: ['get-cart', cartId, cartVersion],
    queryFn: async () => {
      const response = await apiRoot.me().carts().get().execute();
      apiRootStore().setCartId(
        response.body.results.length ? response.body.results[0].id : undefined
      );
      apiRootStore().setCartVersion(
        response.body.results.length ? response.body.results[0].version : 0
      );
      return response.body.results;
    },
  });

  return { data, isPending };
};
