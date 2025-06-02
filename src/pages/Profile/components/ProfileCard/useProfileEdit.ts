import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useProfileEdit = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const version = useApiRootStore((state) => state.version);
  const [addressId, setAddressId] = useState('');

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (actions: MyCustomerUpdateAction[]) => {
      if (actions[0].action === 'addShippingAddressId') {
        const response = await apiRoot
          .me()
          .post({
            body: {
              actions: [{ action: actions[0].action, addressId }],
              version: version,
            },
          })
          .execute();
        apiRootStore().setVersion(response.body.version);
      } else if (actions[0].action === 'addBillingAddressId') {
        const response = await apiRoot
          .me()
          .post({
            body: {
              actions: [{ action: actions[0].action, addressId }],
              version: version,
            },
          })
          .execute();
        apiRootStore().setVersion(response.body.version);
      } else {
        const response = await apiRoot
          .me()
          .post({
            body: {
              actions: actions,
              version: version,
            },
          })
          .execute();
        if (actions[0].action === 'addAddress') {
          setAddressId(
            response.body.addresses[response.body.addresses.length - 1].id || ''
          );
        }
        apiRootStore().setVersion(response.body.version);
        notifications.show({
          title: 'Поздравляем!',
          message: 'Данные успешно обновлены',
          autoClose: 7000,
          withCloseButton: true,
          withBorder: true,
          color: 'green',
        });
      }
    },
    onError: () => {
      notifications.show({
        title: 'Упс!',
        message: 'Что-то пошло не так...',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'red',
      });
    },
  });

  return { isPending, mutateAsync };
};
