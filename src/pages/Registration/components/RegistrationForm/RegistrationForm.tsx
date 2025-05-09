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
import { useForm, isEmail, isNotEmpty, hasLength } from '@mantine/form';
import { IconAt, IconCalendar, IconLock } from '@tabler/icons-react';
import { COUNTRIES } from '@/constants/countries';
import {
  combineRules,
  isCorrectPostalCode,
  isDateDiffLessThan,
  isOnlyLetters,
  notMatches,
} from '@/utils/mantine-validation';

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
      email: combineRules([
        isNotEmpty('Укажите Email'),
        isEmail('Неверный Email'),
      ]),
      password: combineRules([
        hasLength({ min: 8 }, 'Пароль должен содержать 8 символов.'),
        notMatches(
          /[A-ZА-Я]/,
          'Пароль должен содержать хотя-бы 1 заглавную букву. (A-Z, А-Я)'
        ),
        notMatches(
          /[a-zа-я]/,
          'Пароль должен содержать хотя-бы 1 строчную букву. (a-z, а-я)'
        ),
        notMatches(/[0-9]/, 'Пароль должен содержать хотя-бы 1 цифру'),
      ]),
      firstName: combineRules([
        isNotEmpty('Имя должно быть заполнено.'),
        isOnlyLetters('Разрешены только буквы.'),
      ]),
      lastName: combineRules([
        isNotEmpty('Фамилия должно быть заполнено.'),
        isOnlyLetters('Разрешены только буквы.'),
      ]),
      dateOfBirth: combineRules([
        isNotEmpty('Выберите дату.'),
        isDateDiffLessThan(
          { target: 13, unit: 'years' },
          'Чтобы пользоваться нашим сайтом, вы должны быть старше 13 лет.'
        ),
      ]),
      address: {
        street: isNotEmpty('Введите улицу'),
        city: combineRules([
          isNotEmpty('Введите название города'),
          isOnlyLetters('Город должен содержать только буквы'),
        ]),
        postalCode: (value, values) =>
          isCorrectPostalCode(
            (countryName, format) =>
              `Неверный адрес. ${countryName} имеет следующий формат ${format}`
          )(value, values.address.country),
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
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Улица"
                disabled={!isCountrySelected}
                {...getInputProps('address.street')}
                {...(!isCountrySelected ? { error: undefined } : undefined)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Почтовый адрес"
                disabled={!isCountrySelected}
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
          >
            Зарегистрироваться
          </Button>
        </Flex>
      </Box>
    </Center>
  );
};

export default RegistrationForm;
