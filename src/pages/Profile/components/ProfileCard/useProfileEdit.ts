import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export const useProfileEdit = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const version = useApiRootStore((state) => state.version);

  const { isError, isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (actions: MyCustomerUpdateAction[]) => {
      const response = await apiRoot
        .me()
        .post({
          body: {
            actions: actions,
            version: version,
          },
        })
        .execute();
      apiRootStore().setVersion(response.body.version);
    },
    onSuccess: () => {
      notifications.show({
        title: 'Поздравляем!',
        message: 'Данные успешно обновлены',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'green',
      });
    },
  });

  return { isError, isPending, isSuccess, mutateAsync };
};
