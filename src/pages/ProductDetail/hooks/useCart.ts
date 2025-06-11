import { useCartCreate } from './useCartCreate';
import { useApiRootStore } from '@/store/apiRootStore';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useCart = () => {
  const { apiRoot, customer } = useApiRootStore((state) => state);
  const { createdCart, createCart } = useCartCreate();

  const {
    data: cartResponse,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['carts', customer?.id, createdCart?.body.id],
    queryFn: () => apiRoot.me().carts().get().execute(),
  });

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
    if (cartResponse && cartResponse.body.total === 0) {
      createCart()
        .then(() => refetch())
        .catch(() => {});
    }
  }, [cartResponse, createCart, refetch]);

  return { cart: cartResponse?.body?.results?.[0], isPending };
};
