import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import { LoginForm } from './LoginForm';
import '@testing-library/jest-dom';

describe('login form component', () => {
  it('should render form with email and password fields', () => {
    expect.assertions(3);

    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('should show errors when submit button pressed whit empty email and password fields', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: 'Войти' });

    await user.click(submitButton);

    await expect(
      screen.findByText('Email должен содержать @')
    ).resolves.toBeInTheDocument();

    await expect(
      screen.findByText('Пароль должен быть не менее 8 символов')
    ).resolves.toBeInTheDocument();
  });

  it('should show error for invalid email format', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    await expect(
      screen.findByText('Email должен содержать @')
    ).resolves.toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email@@');

    await expect(
      screen.findByText('Должен быть ровно один символ @')
    ).resolves.toBeInTheDocument();
  });

  it('should show error for email with leading/trailing spaces', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, ' user@example.com ');

    await expect(
      screen.findByText('Уберите пробелы в начале или конце email')
    ).resolves.toBeInTheDocument();
  });

  it('should show error for email without domain', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'user@');

    await expect(
      screen.findByText('Укажите домен после @')
    ).resolves.toBeInTheDocument();
  });

  it('should show error for email with invalid domain format', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, 'user@example.');

    await expect(
      screen.findByText('Домен не может заканчиваться точкой')
    ).resolves.toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'user@.example');

    await expect(
      screen.findByText('Домен не может начинаться с точки')
    ).resolves.toBeInTheDocument();
  });

  it('should show error for password with leading/trailing spaces', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/пароль/i);
    await user.type(passwordInput, ' validPass123! ');

    await expect(
      screen.findByText('Уберите пробелы в начале или конце пароля')
    ).resolves.toBeInTheDocument();
  });

  it('should show password requirements errors for weak password', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/пароль/i);
    await user.type(passwordInput, 'simple');

    await expect(
      screen.findByText('Пароль должен быть не менее 8 символов')
    ).resolves.toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'simplepa');

    await expect(
      screen.findByText('Добавьте хотя бы одну заглавную букву (A-Z)')
    ).resolves.toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'SIMPLEPASS');

    await expect(
      screen.findByText('Добавьте хотя бы одну строчную букву (a-z)')
    ).resolves.toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'simplePass');

    await expect(
      screen.findByText('Добавьте хотя бы одну цифру (0-9)')
    ).resolves.toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'simplePass1');

    await expect(
      screen.findByText('Добавьте хотя бы один спецсимвол (!@#$%^&*)')
    ).resolves.toBeInTheDocument();
  });

  it('should enable submit button when form is valid', async () => {
    expect.hasAssertions();

    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: 'Войти' });

    await user.type(emailInput, 'valid.user@example.com');
    await user.type(passwordInput, 'ValidPass123!');

    expect(submitButton).toBeEnabled();
  });

  it('should call submit handler with form data when valid', async () => {
    expect.hasAssertions();

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: 'Войти' });

    await user.type(emailInput, 'valid.user@example.com');
    await user.type(passwordInput, 'ValidPass123!');
    await user.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('Форма отправлена:', {
      email: 'valid.user@example.com',
      password: 'ValidPass123!',
    });

    consoleSpy.mockRestore();
  });

  it('should have working registration link', async () => {
    expect.hasAssertions();

    render(<LoginForm />);

    const registerLink = screen.getByRole('link', {
      name: /зарегистрироваться/i,
    });

    expect(registerLink).toHaveAttribute('href', '/registration');

    await userEvent.click(registerLink);
  });
});
