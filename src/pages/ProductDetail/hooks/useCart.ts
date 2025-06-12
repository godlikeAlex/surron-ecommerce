import { useCartCreate } from './useCartCreate';
import { useApiRootStore } from '@/store/apiRootStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useCartUpdate } from './useCartUpdate';
import { useCartDelete } from './useCartDelete';

export const useCart = () => {
  const { apiRoot, customer } = useApiRootStore((state) => state);
  const { createdCart, createCart } = useCartCreate();
  const { deleteCart } = useCartDelete();

  const {
    data: cartResponse,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['carts', customer?.id, createdCart?.body.id],
    queryFn: () => apiRoot.me().carts().get().execute(),
  });

  const cart = cartResponse?.body?.results?.[0];
  const { addLineItem } = useCartUpdate(cart);
  const addLineItemAndRefetch = useCallback(
    async (productId: string, variantId: number, quantity: number) => {
      await addLineItem(productId, variantId, quantity);
      if (refetch) {
        await refetch();
      }
    },
    [addLineItem, refetch]
  );

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: 'Упс!',
        message: 'Не удалось загрузить корзину',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'red',
      });
    }
  }, [isError]);

  useEffect(() => {
    //void deleteCart();
    if (cartResponse && cartResponse.body.total === 0) {
      createCart()
        .then(() => refetch())
        .catch(() => {});
    }
  }, [cartResponse, createCart, refetch, deleteCart]);

  return { cart, isPending, addLineItem: addLineItemAndRefetch };
};
