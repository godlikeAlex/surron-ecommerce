import { useMemo } from 'react';
import {
  Anchor,
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
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, isNotEmpty } from '@mantine/form';
import { IconAt, IconCalendar, IconLock } from '@tabler/icons-react';
import { COUNTRIES } from '@/constants/countries';
import {
  combineRules,
  isDateDiffLessThan,
  isOnlyLetters,
  validateEmail,
  validatePassword,
  validatePostalCode,
} from '@/utils/mantine-validation';
import AuthService from '@/services/AuthService';
import { Link } from 'react-router';
import classes from './RegistrationForm.module.scss';

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country?: string;
  };
}

const RegistrationForm = () => {
  const { onSubmit, getInputProps, values, watch, validateField } =
    useForm<FormValues>({
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
        email: (email) => validateEmail(email),
        password: (password) => validatePassword(password),
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
        address: {
          street: isNotEmpty('Введите улицу'),
          city: combineRules([
            isNotEmpty('Введите название города'),
            isOnlyLetters('Город должен содержать только буквы'),
          ]),
          postalCode: (postalCode, { address }) =>
            validatePostalCode(postalCode, address.country),
          country: isNotEmpty('Выберите вашу страну'),
        },
      },
      validateInputOnChange: true,
    });

  watch(
    'address.country',
    () => values.address.postalCode && validateField('address.postalCode')
  );

  const isCountrySelected = Boolean(values.address.country);

  const countries = useMemo(() => {
    return COUNTRIES.map(({ code, name, flag }) => ({
      value: code,
      label: `${flag} ${name}`,
    }));
  }, []);

  const handleSubmit = (values: FormValues) => {
    AuthService.register();

    console.log(values);
  };

  return (
    <Center>
      <Box
        component="form"
        onSubmit={onSubmit(handleSubmit)}
        data-testid="registration-form"
        className={classes.registrationForm}
      >
        <Flex
          gap="sm"
          justify="center"
          align="stretch"
          direction="column"
          wrap="wrap"
        >
          <SimpleGrid cols={2}>
            <TextInput
              label="Имя"
              placeholder="Введите имя"
              {...getInputProps('firstName')}
              withAsterisk
            />
            <TextInput
              label="Фамилия"
              placeholder="Введите фамилию"
              {...getInputProps('lastName')}
              withAsterisk
            />
          </SimpleGrid>

          <TextInput
            label="Email"
            placeholder="user@example.com"
            withAsterisk
            leftSection={<IconAt />}
            {...getInputProps('email')}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            withAsterisk
            leftSection={<IconLock />}
            {...getInputProps('password')}
          />

          <DatePickerInput
            label="Дата рождения"
            placeholder="Выберите дату рождения"
            withAsterisk
            leftSection={<IconCalendar />}
            {...getInputProps('dateOfBirth')}
          />

          <Divider my="lg" label={'Адрес'} />

          <Grid>
            <Grid.Col span={12}>
              <Select
                label="Страна"
                placeholder="Выберите страну"
                withAsterisk
                searchable
                data={countries}
                {...getInputProps('address.country')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Город"
                placeholder="Введите город"
                withAsterisk
                disabled={!isCountrySelected}
                {...getInputProps('address.city')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Улица"
                placeholder="Введите улицу"
                withAsterisk
                disabled={!isCountrySelected}
                {...getInputProps('address.street')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Почтовый адрес"
                placeholder="Введите почтовый адрес"
                withAsterisk
                disabled={!isCountrySelected}
                {...getInputProps('address.postalCode')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>
          </Grid>

          <Button
            type="submit"
            fullWidth
            mt={'lg'}
            className={classes.registrationButton}
          >
            Зарегистрироваться
          </Button>

          <Text mt="sm" ta="center">
            Уже зарегистрированы?{' '}
            <Anchor component={Link} to="/login">
              Войти
            </Anchor>
          </Text>
        </Flex>
      </Box>
    </Center>
  );
};

export default RegistrationForm;
