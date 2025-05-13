import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Card,
  Anchor,
  Text,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock } from '@tabler/icons-react';
import { Link } from 'react-router';
import { validateEmail, validatePassword } from '@/utils/mantine-validation';
import classes from './LoginForm.module.scss';

export const LoginForm = () => {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (email) => validateEmail(email),
      password: (password) => validatePassword(password),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Форма отправлена:', values);
  };

  return (
    <Box className={classes.loginContainer}>
      <Card className={classes.loginCard}>
        <Title order={2} className={classes.loginTitle}>
          Вход в систему
        </Title>

        <Box
          component="form"
          onSubmit={form.onSubmit(handleSubmit)}
          className={classes.loginForm}
          data-testid="login-form"
        >
          <TextInput
            label="Email"
            placeholder="user@example.com"
            leftSection={<IconAt size={16} />}
            withAsterisk
            {...form.getInputProps('email')}
            classNames={{ root: classes.loginInput }}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            leftSection={<IconLock size={16} />}
            withAsterisk
            {...form.getInputProps('password')}
            classNames={{ root: classes.loginInput }}
          />

          <Button type="submit" fullWidth className={classes.loginButton}>
            Войти
          </Button>

          <Text mt="sm" ta="center">
            Нет аккаунта?{' '}
            <Anchor component={Link} to="/registration">
              Зарегистрироваться
            </Anchor>
          </Text>
        </Box>
      </Card>
    </Box>
  );
};
