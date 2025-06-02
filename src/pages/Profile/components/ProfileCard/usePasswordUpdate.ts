import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { CustomerChangePassword } from '@commercetools/platform-sdk';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export const usePasswordChange = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const setLogin = useApiRootStore((state) => state.setLogin);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (action: CustomerChangePassword) => {
      try {
        const response = await apiRoot
          .me()
          .password()
          .post({
            body: action,
          })
          .execute();
        if (response.statusCode === 200) {
          setLogin(response.body.email, action.newPassword);
          apiRootStore().setVersion(response.body.version);
          notifications.show({
            title: 'Поздравляем!',
            message: 'Пароль успешно обновлён',
            autoClose: 7000,
            withCloseButton: true,
            withBorder: true,
            color: 'green',
          });
        }
      } catch (error) {
        if (error) console.log();
        notifications.show({
          title: 'Упс!',
          message: 'Не удалось обновить пароль',
          autoClose: 7000,
          withCloseButton: true,
          withBorder: true,
          color: 'red',
        });
      }
    },
  });

  return { isPending, mutateAsync };
};
