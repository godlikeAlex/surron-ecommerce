import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Box,
  Loader,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { validateEmail, validatePassword } from '@/utils/mantine-validation';
import classes from './LoginForm.module.scss';
import { IconAlertCircle, IconAt, IconLock } from '@tabler/icons-react';
import { Link } from 'react-router';
import { useApiRootStore } from '@/store/apiRootStore';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export type AuthFormValues = {
  email: string;
  password: string;
};

interface ApiError {
  statusCode?: number;
  message?: string;
  error?: Array<{
    code: string;
    message: string;
  }>;
}

const errorMessages: Record<string, string> = {
  invalid_customer_account_credentials: 'Неверный email или пароль',
  DEFAULT: 'Произошла ошибка при входе. Пожалуйста, попробуйте снова',
};

export const LoginForm = () => {
  const { logIn } = useApiRootStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<AuthFormValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (email) => validateEmail(email),
      password: (password) => validatePassword(password),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log('Форма отправлена:', values);
    setFormError(null);
    setIsSubmitting(true);

    try {
      const me = await logIn(values);
      notifications.show({
        title: '👋🏻 С возвращением!',
        message: 'Рады видеть вас снова.',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
      });
      console.log({ me });
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthError = (error: unknown) => {
    const apiError = error as ApiError;
    console.error('Authentication error:', error);

    if ([400, 401, 404].includes(apiError?.statusCode as number)) {
      const errorCode = apiError?.error?.[0]?.code;
      const message = errorMessages[errorCode || 'DEFAULT'];

      setFormError(message);
      form.setErrors({
        email: ' ',
        password: ' ',
      });
    } else {
      setFormError(errorMessages['DEFAULT']);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
      className={classes.loginForm}
      data-testid="login-form"
    >
      {formError && (
        <Alert
          icon={<IconAlertCircle />}
          title="Ошибка входа"
          color="red"
          mb="sm"
        >
          {formError}
        </Alert>
      )}

      <TextInput
        label="Email"
        placeholder="user@example.com"
        leftSection={<IconAt />}
        withAsterisk
        {...form.getInputProps('email')}
        classNames={{
          root: classes.loginInput,
        }}
      />

      <PasswordInput
        label="Пароль"
        placeholder="Введите пароль"
        leftSection={<IconLock />}
        withAsterisk
        {...form.getInputProps('password')}
        classNames={{
          root: classes.loginInput,
        }}
      />

      <Button
        type="submit"
        fullWidth
        className={classes.loginButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size="sm" color="white" /> : 'Войти'}
      </Button>

      <Text mt="sm" ta="center">
        Нет аккаунта?{' '}
        <Anchor component={Link} to="/registration">
          Зарегистрироваться
        </Anchor>
      </Text>
    </Box>
  );
};
