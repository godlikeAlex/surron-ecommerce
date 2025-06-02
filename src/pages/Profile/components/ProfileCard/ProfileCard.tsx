import {
  Box,
  Button,
  Divider,
  Flex,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import classes from './ProfileCard.module.scss';
import { useProfileInfo } from './useProfileInfo';
import { COUNTRIES } from '@/constants/countries';
import { ClientResponse, Customer } from '@commercetools/platform-sdk';
import { useProfileEdit } from './useProfileEdit';

const renderAddress = (
  id: string,
  data: ClientResponse<Customer> | undefined,
  isDefault: boolean,
  name: string
) => {
  return (
    <Box key={id}>
      <Flex justify="flex-start" align="center" gap={5}>
        <input
          type="radio"
          name={name}
          id={id}
          value={id}
          checked={isDefault}
        />
        <label htmlFor={id} className={classes.label}>
          {isDefault
            ? 'является адресом по умолчанию'
            : 'не является адересом по умолчанию (сделать)'}
        </label>
      </Flex>
      <Title order={5}>Страна:</Title>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {
          COUNTRIES.find(
            (country) =>
              country.code ===
              data?.body.addresses.find((address) => address.id === id)?.country
          )?.name
        }
      </Text>
      <Title order={5}>Город:</Title>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {data?.body.addresses.find((address) => address.id === id)?.city}
      </Text>
      <Title order={5}>Улица:</Title>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {data?.body.addresses.find((address) => address.id === id)?.streetName}
      </Text>
      <Title order={5}>Почтовый индекс:</Title>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {data?.body.addresses.find((address) => address.id === id)?.postalCode}
      </Text>
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }}>Редактировать адрес</Button>
        <Button style={{ flexGrow: '1' }}>Удалить адрес</Button>
      </Flex>
      <Divider my="md" />
    </Box>
  );
};

export const ProfileCard = () => {
  const { isPending: isPendingInfo, data } = useProfileInfo();
  const { isPending: isPendingEdit, mutateAsync } = useProfileEdit();

  return (
    <Skeleton visible={isPendingInfo || isPendingEdit}>
      <Divider my="sm" label="Персональная информация" />
      <Flex justify="space-between" align="center">
        <Title order={5}>Имя:</Title>
      </Flex>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {isPendingInfo ? '...' : data?.body.firstName}
      </Text>
      <Flex justify="space-between" align="center">
        <Title order={5}>Фамилия:</Title>
      </Flex>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {isPendingInfo ? '...' : data?.body.lastName}
      </Text>
      <Flex justify="space-between" align="center">
        <Title order={5}>Дата рождения:</Title>
      </Flex>
      <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
        {isPendingInfo ? '...' : data?.body.dateOfBirth}
      </Text>
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }}>Редактировать информацию</Button>
      </Flex>
      <Divider my="sm" label="Aдреса доставки" />
      {data?.body.shippingAddressIds?.map((id) =>
        renderAddress(
          id,
          data,
          data?.body.defaultShippingAddressId === id,
          'shipping'
        )
      )}
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }}>Добавить адрес доставки</Button>
      </Flex>
      <Divider my="sm" label="Aдреса выставления счёта" />
      {data?.body.billingAddressIds?.map((id) =>
        renderAddress(
          id,
          data,
          data?.body.defaultBillingAddressId === id,
          'billing'
        )
      )}
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }} onClick={() => void mutateAsync()}>
          Добавить адрес выставления счёта
        </Button>
      </Flex>
      <Divider my="sm" label="Дополнительные возможности" />
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }}>Cменить email</Button>
        <Button style={{ flexGrow: '1' }}>Cменить пароль</Button>
      </Flex>
    </Skeleton>
  );
};
