import { useApiRootStore } from '@/store/apiRootStore';
import { Cart, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCartUpdate = (cart?: Cart) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { mutateAsync: updateCart } = useMutation({
    mutationFn: (actions: MyCartUpdateAction[]) => {
      return apiRoot
        .me()
        .carts()
        .withId({ ID: cart?.id ?? '' })
        .post({
          body: {
            version: cart?.version ?? 1,
            actions,
          },
        })
        .execute();
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка!',
        message: 'Не удалось обновить корзину',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'red',
      });
    },
  });

  const addLineItem = useCallback(
    (productId: string, variantId: number, quantity: number) => {
      return updateCart([
        {
          action: 'addLineItem',
          productId,
          variantId,
          quantity,
        },
      ]);
    },
    [updateCart]
  );

  const removeLineItem = useCallback(
    (lineItemId: string) => {
      return updateCart([
        {
          action: 'removeLineItem',
          lineItemId,
          //quantity,
        },
      ]);
    },
    [updateCart]
  );

  const mergeCartItems = useCallback(
    (sourceCart: Cart) => {
      const updateActions = sourceCart.lineItems.map((item) => ({
        action: 'addLineItem' as const,
        productId: item.productId,
        variantId: item.variant?.id,
        quantity: item.quantity,
      }));

      return updateCart(updateActions);
    },
    [updateCart]
  );

  return { addLineItem, removeLineItem, mergeCartItems };
};
