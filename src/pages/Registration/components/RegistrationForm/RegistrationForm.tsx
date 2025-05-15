import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  PasswordInput,
  SimpleGrid,
  TextInput,
  Text,
  Loader,
  Alert,
  Checkbox,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, isNotEmpty } from '@mantine/form';
import {
  IconAlertCircle,
  IconAt,
  IconCalendar,
  IconLock,
} from '@tabler/icons-react';
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
import {
  AddressPickerInputs,
  AddressPicker,
} from '@/pages/Registration/components/AddressPicker';
import classes from './RegistrationForm.module.scss';

export interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  address: AddressPickerInputs & {
    useAsDefault: boolean;
    useAsBilling: boolean;
  };
  billing: AddressPickerInputs & { useAsDefault: boolean };
}

const RegistrationForm = () => {
  const signupUser = useSignupUser();
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      address: {
        streetName: '',
        city: '',
        postalCode: '',
        country: '',
        useAsDefault: false,
        useAsBilling: false,
      },
      billing: {
        streetName: '',
        city: '',
        postalCode: '',
        country: '',
        useAsDefault: false,
      },
    },
    onValuesChange: (values) => {
      if (values.address.useAsBilling) {
        form.setFieldValue('billing.country', values.address.country);
        form.setFieldValue('billing.city', values.address.city);
        form.setFieldValue('billing.streetName', values.address.streetName);
        form.setFieldValue('billing.postalCode', values.address.postalCode);
      }
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
        streetName: isNotEmpty('Введите улицу'),
        city: combineRules([
          isNotEmpty('Введите название города'),
          isOnlyLetters('Город должен содержать только буквы'),
        ]),
        postalCode: (postalCode, { address }) =>
          validatePostalCode(postalCode, address.country),
        country: isNotEmpty('Выберите вашу страну'),
      },
      billing: {
        streetName: isNotEmpty('Введите улицу'),
        city: combineRules([
          isNotEmpty('Введите название города'),
          isOnlyLetters('Город должен содержать только буквы'),
        ]),
        postalCode: (postalCode, { billing }) =>
          validatePostalCode(postalCode, billing.country),
        country: isNotEmpty('Выберите вашу страну'),
      },
    },
    validateInputOnChange: true,
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = await signupUser.handleSignup(values);

      console.log('SIGNUP USER RESULT', result);
    } catch (error) {
      if (error instanceof ServerErrorValidation) {
        error.response.errors.forEach(({ field, message }) => {
          if (field && field in values) form.setFieldError(field, message);
        });
      }
    }
  };

  return (
    <Center>
      <Box
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
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
              {...form.getInputProps('firstName')}
              disabled={signupUser.isPending}
            />
            <TextInput
              label="Фамилия"
              placeholder="Введите фамилию"
              withAsterisk
              {...form.getInputProps('lastName')}
              disabled={signupUser.isPending}
            />
          </SimpleGrid>

          <TextInput
            label="Email"
            placeholder="user@example.com"
            leftSection={<IconAt />}
            withAsterisk
            {...form.getInputProps('email')}
            disabled={signupUser.isPending}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            withAsterisk
            leftSection={<IconLock />}
            {...form.getInputProps('password')}
            disabled={signupUser.isPending}
          />

          <DatePickerInput
            label="Дата рождения"
            placeholder="Выберите дату рождения"
            withAsterisk
            leftSection={<IconCalendar />}
            {...form.getInputProps('dateOfBirth')}
            disabled={signupUser.isPending}
          />

          <Divider my="lg" label={'Адрес доставки'} />

          <AddressPicker
            path="address"
            form={form}
            disabled={signupUser.isPending}
          />

          <Checkbox
            label="Установить как адрес по умолчанию"
            {...form.getInputProps('address.useAsDefault')}
            disabled={signupUser.isPending}
          />
          <Checkbox
            label="Использовать адрес для выставления счета"
            disabled={signupUser.isPending}
            {...form.getInputProps('address.useAsBilling')}
          />

          <Divider my="lg" label={'Адрес для выставления счета'} />

          <AddressPicker
            path="billing"
            form={form}
            disabled={form.values.address.useAsBilling || signupUser.isPending}
          />

          <Checkbox
            label="Установить по умолчанию"
            {...form.getInputProps('billing.useAsDefault')}
            disabled={signupUser.isPending}
          />

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
