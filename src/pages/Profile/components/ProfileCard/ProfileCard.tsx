import {
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Modal,
  PasswordInput,
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
  CustomerChangePassword,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { useProfileEdit } from './useProfileEdit';
import { useDisclosure } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import {
  combineRules,
  isDateDiffLessThan,
  isOnlyLetters,
  validateConfirmedPassword,
  validateEmail,
  validatePassword,
} from '@/utils/mantine-validation';
import { DatePickerInput } from '@mantine/dates';
import { IconAt, IconCalendar, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useApiRootStore } from '@/store/apiRootStore';
import { usePasswordChange } from './usePasswordUpdate';
import { AddressWithId, ModalAddress } from './ModalAddress';

export interface InfoValues {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

export interface EmailValues {
  email: string;
}

export interface PasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmedPassword: string;
}

const emptyAddress: AddressWithId = {
  country: '',
  city: '',
  postalCode: '',
  streetName: '',
  id: '',
};

export const ProfileCard = () => {
  const { isPending: isPendingEdit, mutateAsync } = useProfileEdit();
  const { isPending: isPendingPassword, mutateAsync: mutatePassword } =
    usePasswordChange();
  const [opened, { open, close }] = useDisclosure(false);
  const [modalState, setModalState] = useState(1);
  const [addressInfo, setAddressInfo] = useState(emptyAddress);
  const [modalAddressState, setModalAddressState] = useState(1);
  const version = useApiRootStore((state) => state.version);

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
  const formEmail = useForm<EmailValues>({
    initialValues: {
      email: '',
    },
    validate: {
      email: (email) => validateEmail(email),
    },
    validateInputOnChange: true,
  });
  const formPassword = useForm<PasswordValues>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmedPassword: '',
    },
    validate: {
      oldPassword: (oldPassword) => validatePassword(oldPassword),
      newPassword: (newPassword) => validatePassword(newPassword),
      confirmedPassword: (confirmedPassword, { newPassword }) =>
        validateConfirmedPassword(confirmedPassword, newPassword),
    },
    validateInputOnChange: true,
  });

  formPassword.watch('newPassword', () => {
    if (formPassword.getValues().confirmedPassword.length > 0)
      formPassword.validateField('confirmedPassword');
  });

  const { isPending: isPendingInfo, data } = useProfileInfo(
    formInfo,
    formEmail
  );

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
            onChange={(e) => {
              if (e.target.value) {
                if (name === 'shipping') {
                  const actions: MyCustomerUpdateAction[] = [
                    { action: 'setDefaultShippingAddress', addressId: id },
                  ];
                  void mutateAsync(actions);
                } else {
                  const actions: MyCustomerUpdateAction[] = [
                    { action: 'setDefaultBillingAddress', addressId: id },
                  ];
                  void mutateAsync(actions);
                }
              }
            }}
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
                data?.body.addresses.find((address) => address.id === id)
                  ?.country
            )?.name
          }
        </Text>
        <Title order={5}>Город:</Title>
        <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
          {data?.body.addresses.find((address) => address.id === id)?.city}
        </Text>
        <Title order={5}>Улица:</Title>
        <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
          {
            data?.body.addresses.find((address) => address.id === id)
              ?.streetName
          }
        </Text>
        <Title order={5}>Почтовый индекс:</Title>
        <Text className={classes.text} style={{ padding: '5px 0 15px' }}>
          {
            data?.body.addresses.find((address) => address.id === id)
              ?.postalCode
          }
        </Text>
        <Flex gap={10} wrap="wrap">
          <Button
            style={{ flexGrow: '1' }}
            className={classes.profileButton}
            onClick={() => {
              setModalState(4);
              setModalAddressState(3);
              setAddressInfo({
                city:
                  data?.body.addresses.find((address) => address.id === id)
                    ?.city || '',
                country:
                  data?.body.addresses.find((address) => address.id === id)
                    ?.country || '',
                postalCode:
                  data?.body.addresses.find((address) => address.id === id)
                    ?.postalCode || '',
                streetName:
                  data?.body.addresses.find((address) => address.id === id)
                    ?.streetName || '',
                id: id,
              });
              open();
            }}
          >
            Редактировать адрес
          </Button>
          <Button
            style={{ flexGrow: '1' }}
            color="red"
            onClick={() => {
              void removeAddress(id);
            }}
          >
            Удалить адрес
          </Button>
        </Flex>
        <Divider my="md" />
      </Box>
    );
  };

  const removeAddress = async (id: string) => {
    const actions: MyCustomerUpdateAction[] = [
      { action: 'removeAddress', addressId: id },
    ];
    await mutateAsync(actions);
  };

  const handleSubmitInfo = async (values: InfoValues) => {
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
  };

  const handleSubmitEmail = async (values: EmailValues) => {
    const actions: MyCustomerUpdateAction[] = [
      { action: 'changeEmail', email: values.email },
    ];
    await mutateAsync(actions);
    close();
  };

  const handleSubmitPassword = async (values: PasswordValues) => {
    const action: CustomerChangePassword = {
      currentPassword: values.oldPassword,
      id: data?.body.id || '',
      newPassword: values.newPassword,
      version,
    };
    await mutatePassword(action);
    close();
  };

  return (
    <Skeleton
      visible={isPendingInfo || isPendingEdit}
      className={classes.profileContainer}
    >
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
        className={classes.profileModal}
        title={
          modalState === 1
            ? 'Редактировать информацию'
            : modalState === 2
              ? 'Редактировать email'
              : modalState === 3
                ? 'Сменить пароль'
                : 'Введите адрес'
        }
        centered
      >
        {modalState === 1 ? (
          <Box component="form" onSubmit={formInfo.onSubmit(handleSubmitInfo)}>
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
                className={classes.profileButton}
                style={{ flexGrow: '1', marginTop: '10px' }}
              >
                {isPendingEdit ? (
                  <Loader size="sm" color="white" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </Flex>
          </Box>
        ) : modalState === 2 ? (
          <Box
            component="form"
            onSubmit={formEmail.onSubmit(handleSubmitEmail)}
          >
            <TextInput
              label="Email"
              placeholder="user@example.com"
              leftSection={<IconAt />}
              withAsterisk
              {...formEmail.getInputProps('email')}
              disabled={isPendingEdit}
            />
            <Flex gap={10} wrap="wrap">
              <Button
                type="submit"
                disabled={isPendingEdit}
                className={classes.profileButton}
                style={{ flexGrow: '1', marginTop: '10px' }}
              >
                {isPendingEdit ? (
                  <Loader size="sm" color="white" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </Flex>
          </Box>
        ) : modalState === 3 ? (
          <Box
            component="form"
            onSubmit={formPassword.onSubmit(handleSubmitPassword)}
          >
            <PasswordInput
              label="Старый пароль"
              placeholder="Введите пароль"
              type="password"
              withAsterisk
              leftSection={<IconLock />}
              {...formPassword.getInputProps('oldPassword')}
              disabled={isPendingPassword}
            />
            <PasswordInput
              label="Новый пароль"
              placeholder="Введите пароль"
              type="password"
              withAsterisk
              leftSection={<IconLock />}
              {...formPassword.getInputProps('newPassword')}
              disabled={isPendingPassword}
            />
            <PasswordInput
              label="Повторите новый пароль"
              placeholder="Введите пароль"
              type="password"
              withAsterisk
              leftSection={<IconLock />}
              {...formPassword.getInputProps('confirmedPassword')}
              disabled={isPendingPassword}
            />
            <Flex gap={10} wrap="wrap">
              <Button
                type="submit"
                disabled={isPendingEdit}
                className={classes.profileButton}
                style={{ flexGrow: '1', marginTop: '10px' }}
              >
                {isPendingEdit ? (
                  <Loader size="sm" color="white" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </Flex>
          </Box>
        ) : (
          <ModalAddress
            close={close}
            submitType={modalAddressState}
            addressWithId={addressInfo}
          ></ModalAddress>
        )}
      </Modal>
      <Flex gap={10} wrap="wrap">
        <Button
          style={{ flexGrow: '1' }}
          className={classes.profileButton}
          onClick={() => {
            setModalState(1);
            open();
          }}
        >
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
        <Button
          style={{ flexGrow: '1' }}
          color="black"
          onClick={() => {
            setModalState(4);
            setModalAddressState(1);
            setAddressInfo(emptyAddress);
            open();
          }}
        >
          Добавить адрес доставки
        </Button>
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
        <Button
          style={{ flexGrow: '1' }}
          color="black"
          onClick={() => {
            setModalState(4);
            setModalAddressState(2);
            setAddressInfo(emptyAddress);
            open();
          }}
        >
          Добавить адрес выставления счёта
        </Button>
      </Flex>
      <Divider my="sm" label="Дополнительные возможности" />
      <Flex gap={10} wrap="wrap">
        <Button
          style={{ flexGrow: '1' }}
          className={classes.profileButton}
          onClick={() => {
            setModalState(2);
            open();
          }}
        >
          Cменить email
        </Button>
        <Button
          style={{ flexGrow: '1' }}
          className={classes.profileButton}
          onClick={() => {
            setModalState(3);
            open();
          }}
        >
          Cменить пароль
        </Button>
      </Flex>
    </Skeleton>
  );
};
