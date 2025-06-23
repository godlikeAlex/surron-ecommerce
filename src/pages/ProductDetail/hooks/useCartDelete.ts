import { useApiRootStore } from '@/store/apiRootStore';
import { useMutation } from '@tanstack/react-query';

export const useCartDelete = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const {
    data: deletedCart,
    mutateAsync: deleteCart,
    isPending,
  } = useMutation({
    mutationFn: ({ id, version }: { id: string; version: number }) =>
      apiRoot
        .me()
        .carts()
        .withId({ ID: id })
        .delete({
          queryArgs: {
            version: version,
          },
        })
        .execute(),
    onError: (error) => {
      console.error(error);
    },
  });

  return { deletedCart, deleteCart, isPending };
};
