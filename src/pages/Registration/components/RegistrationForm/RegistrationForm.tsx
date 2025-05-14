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
  Loader,
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, isNotEmpty } from '@mantine/form';
import {
  IconAlertCircle,
  IconAt,
  IconCalendar,
  IconLock,
} from '@tabler/icons-react';
import { COUNTRIES } from '@/constants/countries';
import {
  combineRules,
  isDateDiffLessThan,
  isOnlyLetters,
  validateEmail,
  validatePassword,
  validatePostalCode,
} from '@/utils/mantine-validation';
import { Link } from 'react-router';
import { useSignupUser } from './useSignupUser';
import { ServerErrorValidation } from '@/errors/ServerErrorValidation';
import { useApiRootStore } from '@/store/apiRootStore';
import classes from './RegistrationForm.module.scss';

export interface FormValues {
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
  const signupUser = useSignupUser();
  const store = useApiRootStore();

  const {
    onSubmit,
    getInputProps,
    values,
    watch,
    validateField,
    setFieldError,
  } = useForm<FormValues>({
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

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = await signupUser.handleSignup(values);

      console.log(result, 'RESULT');

      store.setLogin(values.email, values.password);
    } catch (error) {
      if (error instanceof ServerErrorValidation) {
        error.response.errors.forEach(({ field, message }) => {
          if (field && field in values) setFieldError(field, message);
        });
      }
    }
  };

  return (
    <Center>
      <Box
        component="form"
        onSubmit={onSubmit(handleSubmit)}
        data-testid="registration-form"
        className={classes.registrationForm}
      >
        {signupUser.error && (
          <Alert
            title="Ошибка регистрации"
            icon={<IconAlertCircle size={16} />}
            color="red"
            mb="md"
          >
            {signupUser.error.response.general}
          </Alert>
        )}
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
              withAsterisk
              {...getInputProps('firstName')}
              disabled={signupUser.isPending}
            />
            <TextInput
              label="Фамилия"
              placeholder="Введите фамилию"
              withAsterisk
              {...getInputProps('lastName')}
              disabled={signupUser.isPending}
            />
          </SimpleGrid>

          <TextInput
            label="Email"
            placeholder="user@example.com"
            leftSection={<IconAt />}
            withAsterisk
            {...getInputProps('email')}
            disabled={signupUser.isPending}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            withAsterisk
            leftSection={<IconLock />}
            {...getInputProps('password')}
            disabled={signupUser.isPending}
          />

          <DatePickerInput
            label="Дата рождения"
            placeholder="Выберите дату рождения"
            withAsterisk
            leftSection={<IconCalendar />}
            {...getInputProps('dateOfBirth')}
            disabled={signupUser.isPending}
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
                disabled={signupUser.isPending}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Город"
                placeholder="Введите город"
                withAsterisk
                disabled={!isCountrySelected || signupUser.isPending}
                {...getInputProps('address.city')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Улица"
                placeholder="Введите улицу"
                withAsterisk
                disabled={!isCountrySelected || signupUser.isPending}
                {...getInputProps('address.street')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Почтовый адрес"
                placeholder="Введите почтовый адрес"
                withAsterisk
                disabled={!isCountrySelected || signupUser.isPending}
                {...getInputProps('address.postalCode')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>
          </Grid>

          <Button
            type="submit"
            variant="filled"
            color="rgba(0, 0, 0, 1)"
            mt={'lg'}
            className={classes.registrationButton}
            disabled={signupUser.isPending}
          >
            {signupUser.isPending ? (
              <Loader size="sm" color="white" />
            ) : (
              'Зарегистрироваться'
            )}
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
