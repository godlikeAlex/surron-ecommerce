import { useApiRootStore } from '@/store/apiRootStore';
import { Cart } from '@commercetools/platform-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCartDelete = (cart?: Cart) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const {
    data: deletedCart,
    mutateAsync: deleteCart,
    isPending,
  } = useMutation({
    mutationFn: () =>
      apiRoot
        .me()
        .carts()
        .withId({ ID: cart?.id ?? '' })
        .delete({
          queryArgs: {
            version: cart?.version || 1,
          },
        })
        .execute(),
    onError: (error) => {
      console.error(error);
    },
  });

  return { deletedCart, deleteCart, isPending };
};
