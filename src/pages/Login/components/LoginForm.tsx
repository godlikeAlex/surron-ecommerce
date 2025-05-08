import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Title, Card } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import classes from './LoginForm.module.scss';

export const LoginForm = () => {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => {
        const trimmed = value.trim();
        if (trimmed !== value)
          return 'Уберите пробелы в начале или конце email';
        if (!value.includes('@')) return 'Email должен содержать @';
        if (value.split('@').length !== 2)
          return 'Должен быть ровно один символ @';

        const [, domain] = value.split('@');
        if (!domain) return 'Укажите домен после @';
        if (!domain.includes('.'))
          return 'Домен должен содержать точку (например: example.com)';
        if (domain.startsWith('.')) return 'Домен не может начинаться с точки';
        if (domain.endsWith('.')) return 'Домен не может заканчиваться точкой';

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return 'Некорректный формат email (пример: user@example.com)';
        }
        return null;
      },
      password: (value) => {
        const trimmed = value.trim();
        if (trimmed !== value)
          return 'Уберите пробелы в начале или конце пароля';
        if (value.length < 8) return 'Пароль должен быть не менее 8 символов';
        if (!/[A-Z]/.test(value))
          return 'Добавьте хотя бы одну заглавную букву (A-Z)';
        if (!/[a-z]/.test(value))
          return 'Добавьте хотя бы одну строчную букву (a-z)';
        if (!/[0-9]/.test(value)) return 'Добавьте хотя бы одну цифру (0-9)';
        if (!/[!@#$%^&*]/.test(value))
          return 'Добавьте хотя бы один спецсимвол (!@#$%^&*)';
        return null;
      },
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Форма отправлена:', values);
  };

  return (
    <div className={classes['login-container']}>
      <Card className={classes['login-card']}>
        <Title order={2} className={classes['login-title']}>
          Вход в систему
        </Title>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className={classes['login-form']}
        >
          <TextInput
            label="Email"
            placeholder="user@example.com"
            leftSection={<IconAt size={16} />}
            withAsterisk
            {...form.getInputProps('email')}
            classNames={{ root: classes['login-input'] }}
          />

          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            leftSection={<IconLock size={16} />}
            withAsterisk
            {...form.getInputProps('password')}
            classNames={{ root: classes['login-input'] }}
          />

          <Button
            type="submit"
            fullWidth
            className={classes['login-button']}
            disabled={!form.isValid()}
          >
            Войти
          </Button>
        </form>
      </Card>
    </div>
  );
};
