import { queryClient } from '@/main';
import { useApiRootStore } from '@/store/apiRootStore';
import { ByProjectKeyRequestBuilder, Cart } from '@commercetools/platform-sdk';
import { useQuery } from '@tanstack/react-query';

export const CART_KEY = ['ACTIVE-CART'];

export const useActiveCart = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      try {
        const response = await apiRoot.me().activeCart().get().execute();

        return response.body;
      } catch {
        console.log('[INFO] NO CART FOR THIS SESSION');
        return null;
      }
    },
  });
};

export const withActiveCart = (apiRoot: ByProjectKeyRequestBuilder) => {
  let cart = queryClient.getQueryData<Cart>(CART_KEY);

  return async (
    fn: (cartInfo: { cartID: string; cartVersion: number }) => Promise<Cart>
  ) => {
    if (!cart) {
      try {
        const createdCart = await apiRoot
          .me()
          .carts()
          .post({
            body: { currency: 'RUB' },
          })
          .execute();

        queryClient.setQueryData(CART_KEY, createdCart.body);

        cart = createdCart.body;
      } catch {
        console.log('[INFO] ERROR WHILE CREATING CART');
      }
    }

    if (!cart) return;

    const newActiveCart = await fn({
      cartID: cart.id,
      cartVersion: cart.version,
    });

    queryClient.setQueryData(CART_KEY, newActiveCart);
  };
};
