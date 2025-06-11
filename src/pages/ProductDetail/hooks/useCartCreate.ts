import { useApiRootStore } from '@/store/apiRootStore';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export const useCartCreate = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const {
    data: createdCart,
    mutateAsync: createCart,
    isPending,
  } = useMutation({
    mutationFn: () =>
      apiRoot
        .me()
        .carts()
        .post({
          body: {
            currency: 'RUR',
          },
        })
        .execute(),
    onError: () => {
      notifications.show({
        title: 'Ошибка!',
        message: 'Не удалось добавить товар в корзину',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'red',
      });
    },
  });

  return { createdCart, createCart, isPending };
};
