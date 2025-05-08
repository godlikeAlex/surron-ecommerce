import { useMemo } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  PasswordInput,
  Select,
  SimpleGrid,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, isEmail, isNotEmpty } from '@mantine/form';
import { IconAt, IconCalendar, IconLock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { COUNTRIES } from '@/constants/countries';
import { POSTAL_CODES } from '@/constants/postal-codes';

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  country?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: undefined;
  };
}

const RegistrationForm = () => {
  const { onSubmit, getInputProps, values } = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: undefined,
      },
    },
    validate: {
      email: isEmail('Неверный Email'),
      password: (password) => {
        if (password.length < 8) return 'Пароль должен содержать 8 символов.';

        if (!/[A-Z]/.test(password))
          return 'Пароль должен содержать хотя-бы 1 заглавную букву.';

        if (!/[a-z]/.test(password))
          return 'Пароль должен содержать хотя-бы 1 строчную букву.';

        if (!/[0-9]/.test(password))
          return 'Пароль должен содержать хотя-бы 1 цифру';
      },
      firstName: (firstName) => {
        if (firstName.length === 0) return 'Имя должно быть заполнено.';

        if (!/^[A-Za-zА-Яа-яЁё]+$/.test(firstName))
          return 'Разрешены только буквы.';
      },
      lastName: (lastName) => {
        if (lastName.length === 0) return 'Фамилия должна быть заполнена.';

        if (!/^[A-Za-zА-Яа-яЁё]+$/.test(lastName))
          return 'Разрешены только буквы.';
      },
      dateOfBirth: (dateOfBirth) => {
        if (!dateOfBirth) return 'Выберите дату.';

        const yearsOfUser = dayjs(Date.now()).diff(dayjs(dateOfBirth), 'years');

        if (yearsOfUser <= 13)
          return 'Чтобы пользоваться нашим сайтом, вы должны быть старше 13 лет.';
      },
      address: {
        street: isNotEmpty('Введите улицу'),
        city: isNotEmpty('Введите название города'),
        postalCode: (value, { address }) => {
          const { country } = address;

          if (!country) return false;

          const targetPostalCode = POSTAL_CODES.find(
            (postalCode) => postalCode.iso === country
          );

          if (!targetPostalCode) return true; // Если нет почтового кода, разрешаем любой

          if (!targetPostalCode.regex.test(value)) {
            return `Неверный адрес. ${targetPostalCode.countryName} имеет следующий формат ${targetPostalCode.format}`;
          }
        },
        country: isNotEmpty('Выберите вашу страну'),
      },
    },
  });

  const isCountrySelected = Boolean(values.address.country);

  const countries = useMemo(() => {
    return COUNTRIES.map(({ code, name, flag }) => ({
      value: code,
      label: `${flag} ${name}`,
    }));
  }, []);

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Center>
      <Box component="form" onSubmit={onSubmit(handleSubmit)}>
        <Flex
          gap="sm"
          justify="center"
          align="stretch"
          direction="column"
          wrap="wrap"
        >
          <SimpleGrid cols={2}>
            <TextInput label="Имя" {...getInputProps('firstName')} />
            <TextInput label="Фамилия" {...getInputProps('lastName')} />
          </SimpleGrid>

          <TextInput
            label="Email"
            type="email"
            leftSection={<IconAt />}
            {...getInputProps('email')}
          />

          <PasswordInput
            label="Пароль"
            type="password"
            leftSection={<IconLock />}
            {...getInputProps('password')}
          />

          <DatePickerInput
            label="Дата рождения"
            leftSection={<IconCalendar />}
            {...getInputProps('dateOfBirth')}
          />

          <Divider my="lg" label={'Адрес'} />

          <Grid>
            <Grid.Col span={12}>
              <Select
                label="Выберите страну"
                placeholder="Выбрать страну"
                searchable
                data={countries}
                {...getInputProps('address.country')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Город"
                disabled={!isCountrySelected}
                {...getInputProps('address.city')}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Улица"
                disabled={!isCountrySelected}
                {...getInputProps('address.street')}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Почтовый адрес"
                disabled={!isCountrySelected}
                {...getInputProps('address.postalCode')}
              />
            </Grid.Col>
          </Grid>

          <Button
            type="submit"
            variant="filled"
            color="rgba(0, 0, 0, 1)"
            mt={'lg'}
          >
            Зарегистрироваться
          </Button>
        </Flex>
      </Box>
    </Center>
  );
};

export default RegistrationForm;
