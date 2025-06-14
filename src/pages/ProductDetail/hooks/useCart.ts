import { useCartCreate } from './useCartCreate';
import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useCartUpdate } from './useCartUpdate';
import { useCartDelete } from './useCartDelete';

export const useCart = () => {
  const {
    apiRoot,
    customer,
    cart: prevCart,
    setCart,
  } = useApiRootStore((state) => state);
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
          console.log('here');
          console.log(result.body.results?.[0]?.id ?? '');
          apiRootStore().setCartId(result.body.results?.[0]?.id ?? '');
          return result;
        });
    },
  });

  useEffect(() => {
    console.log('[useCart] customerId has changed', customerId);
  }, [customerId]);

  const cart = cartResponse?.body?.results?.[0];
  const { addLineItem, removeLineItem, mergeCartItems } = useCartUpdate(cart);

  const addLineItemAndRefetch = useCallback(
    async (productId: string, variantId: number, quantity: number) => {
      console.log('[useCart] adding item', { productId, variantId, quantity });
      await addLineItem(productId, variantId, quantity);
      if (refetch) {
        await refetch();
      }
    },
    [addLineItem, refetch]
  );

  const removeLineItemAndRefetch = useCallback(
    async (lineItemId: string) => {
      console.log('[useCart] removing item', { lineItemId });
      await removeLineItem(lineItemId);
      if (refetch) {
        await refetch();
      }
    },
    [removeLineItem, refetch]
  );

  const mergingCart = useRef<string>(undefined);
  useEffect(() => {
    if (
      cart?.id &&
      prevCart &&
      cart?.id !== prevCart.id &&
      // мержим только если пользователь залогинился
      customerId &&
      !mergingCart.current
    ) {
      console.log('[useCart] cart changed, merging...', {
        prevCartId: prevCart.id,
        cartId: cart?.id,
      });
      mergingCart.current = cart?.id;
      void mergeCartItems(prevCart).then(() => {
        void refetch();
        mergingCart.current = undefined;
      });
    }
    if (cart) {
      setCart(cart);
    }
  }, [cart, mergeCartItems, prevCart, setCart, refetch, customerId]);

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
  };
};
