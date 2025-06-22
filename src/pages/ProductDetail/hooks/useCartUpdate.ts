import { useApiRootStore } from '@/store/apiRootStore';
import { MyCartUpdateAction } from '@commercetools/platform-sdk';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCartUpdate = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { mutateAsync: updateCart, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({
      actions,
      id,
      version,
    }: {
      actions: MyCartUpdateAction[];
      id: string;
      version: number;
    }) => {
      return apiRoot
        .me()
        .carts()
        .withId({ ID: id })
        .post({
          body: {
            version: version,
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
    (
      productId: string,
      variantId: number,
      quantity: number,
      id: string,
      version: number
    ) => {
      const actions: MyCartUpdateAction[] = [
        {
          action: 'addLineItem',
          productId,
          variantId,
          quantity,
        },
      ];
      return updateCart({ actions, id, version });
    },
    [updateCart]
  );

  const removeLineItem = useCallback(
    (lineItemId: string, id: string, version: number) => {
      const actions: MyCartUpdateAction[] = [
        {
          action: 'removeLineItem',
          lineItemId,
          //quantity,
        },
      ];
      return updateCart({ actions, id, version });
    },
    [updateCart]
  );

  return { addLineItem, removeLineItem, isPendingUpdate };
};
