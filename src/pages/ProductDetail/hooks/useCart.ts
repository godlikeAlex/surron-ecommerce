import { useCartCreate } from './useCartCreate';
import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useCartUpdate } from './useCartUpdate';
import { useCartDelete } from './useCartDelete';

export const useCart = () => {
  const { apiRoot, customer } = useApiRootStore((state) => state);
  const { createdCart, createCart } = useCartCreate();
  const { deleteCart } = useCartDelete();
  const customerId = customer?.id;
  const createdCartId = createdCart?.body.id;
  const {
    data: cartResponse,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['carts', customerId, createdCartId],
    queryFn: () => {
      console.log('[useCart] fetching', { customerId, createdCartId });
      return apiRoot
        .me()
        .carts()
        .get()
        .execute()
        .then((result) => {
          console.log('[useCart] fetch completed', {
            result: result?.body?.results?.[0],
          });
          apiRootStore().setTotalCart(
            result?.body?.results?.[0]?.totalLineItemQuantity ?? 0
          );
          apiRootStore().setCartId(result.body.results?.[0]?.id ?? '');
          return result;
        });
    },
  });

  useEffect(() => {
    console.log('[useCart] customerId has changed', customerId);
  }, [customerId]);

  const cart = cartResponse?.body?.results?.[0];
  const { addLineItem, removeLineItem, pendingUpdate } = useCartUpdate();

  const addLineItemAndRefetch = useCallback(
    async (
      productId: string,
      variantId: number,
      quantity: number,
      idUpd: string,
      versionUpd: number
    ) => {
      console.log('[useCart] adding item', { productId, variantId, quantity });
      if (cart)
        await addLineItem(productId, variantId, quantity, idUpd, versionUpd);
      if (refetch) {
        await refetch();
      }
    },
    [addLineItem, refetch, cart]
  );

  const removeLineItemAndRefetch = useCallback(
    async (lineItemId: string, idUpd: string, versionUpd: number) => {
      console.log('[useCart] removing item', { lineItemId });
      if (cart) await removeLineItem(lineItemId, idUpd, versionUpd);
      if (refetch) {
        await refetch();
      }
    },
    [removeLineItem, refetch, cart]
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
      console.log('[useCart] user has no carts, creating one');
      createCart()
        .then(() => refetch())
        .catch(() => {});
    }
  }, [cartResponse, createCart, refetch, deleteCart]);

  return {
    cart,
    isPending,
    addLineItem: addLineItemAndRefetch,
    removeLineItem: removeLineItemAndRefetch,
    refetch,
    pendingUpdate,
  };
};
