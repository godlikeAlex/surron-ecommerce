import {
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Modal,
  Skeleton,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './ProfileCard.module.scss';
import { useProfileInfo } from './useProfileInfo';
import { COUNTRIES } from '@/constants/countries';
import {
  ClientResponse,
  Customer,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { useProfileEdit } from './useProfileEdit';
import { useDisclosure } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import {
  combineRules,
  isDateDiffLessThan,
  isOnlyLetters,
} from '@/utils/mantine-validation';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

export interface InfoValues {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

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
          defaultChecked={isDefault}
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
  const { isPending: isPendingEdit, mutateAsync } = useProfileEdit();
  const [opened, { open, close }] = useDisclosure(false);

  const formInfo = useForm<InfoValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
    },
    validate: {
      firstName: combineRules([
        isNotEmpty('Имя должно быть заполнено'),
        isOnlyLetters('Разрешены только буквы'),
      ]),
      lastName: combineRules([
        isNotEmpty('Фамилия должна быть заполнена'),
        isOnlyLetters('Разрешены только буквы'),
      ]),
      dateOfBirth: combineRules([
        isNotEmpty('Выберите дату'),
        isDateDiffLessThan(
          { target: 13, unit: 'years' },
          'Чтобы пользоваться нашим сайтом, вы должны быть старше 13 лет'
        ),
      ]),
    },
    validateInputOnChange: true,
  });
  const { isPending: isPendingInfo, data } = useProfileInfo(formInfo);

  const handleSubmit = async (values: InfoValues) => {
    const actions: MyCustomerUpdateAction[] = [
      { action: 'setFirstName', firstName: values.firstName },
      {
        action: 'setLastName',
        lastName: values.lastName,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: values.dateOfBirth,
      },
    ];
    await mutateAsync(actions);
    close();
    console.log(values);
  };
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
      <Modal
        opened={opened}
        onClose={close}
        title="Редактировать информацию"
        centered
      >
        <Box component="form" onSubmit={formInfo.onSubmit(handleSubmit)}>
          <TextInput
            label="Имя"
            placeholder="Введите имя"
            withAsterisk
            {...formInfo.getInputProps('firstName')}
            disabled={isPendingEdit}
          />
          <TextInput
            label="Фамилия"
            placeholder="Введите фамилию"
            withAsterisk
            {...formInfo.getInputProps('lastName')}
            disabled={isPendingEdit}
          />
          <DatePickerInput
            label="Дата рождения"
            placeholder="Выберите дату рождения"
            withAsterisk
            leftSection={<IconCalendar />}
            disabled={isPendingEdit}
            {...formInfo.getInputProps('dateOfBirth')}
          />
          <Flex gap={10} wrap="wrap">
            <Button
              type="submit"
              disabled={isPendingEdit}
              style={{ flexGrow: '1', marginTop: '10px' }}
            >
              {isPendingEdit ? <Loader size="sm" color="white" /> : 'Сохранить'}
            </Button>
          </Flex>
        </Box>
      </Modal>
      <Flex gap={10} wrap="wrap">
        <Button style={{ flexGrow: '1' }} onClick={open}>
          Редактировать информацию
        </Button>
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
        <Button style={{ flexGrow: '1' }}>
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
