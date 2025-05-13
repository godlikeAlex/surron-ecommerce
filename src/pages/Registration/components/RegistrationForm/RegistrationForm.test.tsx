import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, userEvent } from '@/tests/utils';
import RegistrationForm from './RegistrationForm';
import { UserEvent } from '@testing-library/user-event';
import { COUNTRIES } from '@/constants/countries';
import React from 'react';
import dayjs from 'dayjs';
import AuthService from '@/services/AuthService';
import { DatePickerInput } from '@mantine/dates';

const authServiceSpy = vi.spyOn(AuthService, 'register');

vi.mock('@mantine/dates', async (importOriginal) => {
  const { DatePickerInput } =
    await importOriginal<typeof import('@mantine/dates')>();

  return {
    DatePickerInput: (props: React.ComponentProps<typeof DatePickerInput>) => (
      <DatePickerInput
        {...props}
        {...{
          popoverProps: {
            withinPortal: false,
            transitionProps: { duration: 0 },
          },
          modalProps: {
            withinPortal: false,
            transitionProps: { duration: 0 },
          },
        }}
      />
    ),
  };
});

async function selectCountry(user: UserEvent) {
  const [country] = COUNTRIES;

  await user.click(screen.getByRole('textbox', { name: 'Страна' }));
  await user.click(screen.getByText(`${country.flag} ${country.name}`));
}

describe('component RegistrationForm', () => {
  it('should renders as form', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
  });

  it('should render general inputs', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const fistNameInput = screen.getByLabelText(/имя/i);
    const lastNameInput = screen.getByLabelText(/фамилия/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const birthdayInput = screen.getByLabelText(/дата рождения/i);

    expect(fistNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(birthdayInput).toBeInTheDocument();
  });

  it('should not invoke submit handler when validation not passed', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    expect(authServiceSpy).not.toHaveBeenCalled();
  });

  it('should invoke submit handler when validation passed', async () => {
    expect.hasAssertions();

    const MantineDates = await import('@mantine/dates');
    const spyDatePickerInput = vi
      .spyOn(MantineDates, 'DatePickerInput')
      .mockImplementation(
        ({
          value,
          label,
          error,
          onChange: onChangeInput,
        }: React.ComponentProps<typeof DatePickerInput>) => (
          <>
            <label htmlFor="mock-input-date">{label}</label>
            <input
              id="mock-input-date"
              value={value?.toString()}
              onChange={(event) =>
                onChangeInput && onChangeInput(event.target.value)
              }
              type="text"
            />
            {error}
          </>
        )
      );

    render(<RegistrationForm />);

    try {
      const form = screen.getByTestId('registration-form');
      const user = userEvent.setup();

      const firstNameInput = screen.getByLabelText(/имя/i);
      const lastNameInput = screen.getByLabelText(/фамилия/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/пароль/i);
      const dateOfBirth = screen.getByLabelText(/дата рождения/i);

      const street = screen.getByLabelText(/улица/i);
      const cityInput = screen.getByLabelText(/город/i);
      const postalAddressInput = screen.getByLabelText(/почтовый адрес/i);

      await user.type(emailInput, 'user@example.com');
      await user.type(firstNameInput, 'Aleksandr');
      await user.type(lastNameInput, 'Yurkovskiy');
      await user.type(passwordInput, '123456Sss$');
      await user.type(dateOfBirth, '2001-05-05');

      await selectCountry(user);

      await user.type(street, 'Улица Гагарина');
      await user.type(cityInput, 'Самарканд');
      await user.type(postalAddressInput, '666 666');

      fireEvent.submit(form);

      expect(authServiceSpy).toHaveBeenCalledWith();
    } finally {
      spyDatePickerInput.mockRestore();
    }
  });

  it('should render address inputs', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const cityInput = screen.getByLabelText(/город/i);
    const street = screen.getByLabelText(/улица/i);
    const postalAddressInput = screen.getByLabelText(/почтовый адрес/i);
    const countryInput = screen.getByPlaceholderText(/Выберите страну/i);

    expect(cityInput).toBeInTheDocument();
    expect(street).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(postalAddressInput).toBeInTheDocument();
  });

  it('street, city, postal code is disabled when country empty', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    const street = screen.getByLabelText(/улица/i);
    const cityInput = screen.getByLabelText(/город/i);
    const postalAddressInput = screen.getByLabelText(/почтовый адрес/i);

    expect(cityInput).toBeDisabled();
    expect(postalAddressInput).toBeDisabled();
    expect(street).toBeDisabled();
  });
});

describe('validation component RegistrationForm', () => {
  describe('email', () => {
    it('shows error for invalid email format', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
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

    it('shows error for email with leading/trailing spaces', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, '  user@example.com  ');

      await expect(
        screen.findByText('Уберите пробелы в начале или конце email')
      ).resolves.toBeInTheDocument();
    });

    it('shows error for email without domain', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'user@');

      await expect(
        screen.findByText('Укажите домен после @')
      ).resolves.toBeInTheDocument();
    });

    it('shows error for email with invalid domain format', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
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
  });

  it('shows firstName validation error when is empty', async () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    await expect(
      screen.findByText('Имя должно быть заполнено')
    ).resolves.toBeInTheDocument();
  });

  it('shows lastName validation error when is empty', async () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    await expect(
      screen.findByText('Фамилия должна быть заполнена')
    ).resolves.toBeInTheDocument();
  });

  describe('dateOfBirth', () => {
    it('shows dateOfBirth validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');

      fireEvent.submit(form);

      await expect(
        screen.findByText('Выберите дату')
      ).resolves.toBeInTheDocument();
    });

    it('shows dateOfBirth validation error when entered under 13 years', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
      const user = userEvent.setup();

      await user.click(screen.getByLabelText(/дата рождения/i));

      const buttonCurrentDate = screen.getByLabelText(
        new RegExp(dayjs().format('D MMMM YYYY'), 'i')
      );

      await user.click(buttonCurrentDate);

      await expect(
        screen.findByText(
          'Чтобы пользоваться нашим сайтом, вы должны быть старше 13 лет'
        )
      ).resolves.toBeInTheDocument();
    });
  });

  describe('address', () => {
    it('shows country validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');

      fireEvent.submit(form);

      await expect(
        screen.findByText('Выберите вашу страну')
      ).resolves.toBeInTheDocument();
    });

    it('shows street validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');
      const user = userEvent.setup();

      await selectCountry(user);

      fireEvent.submit(form);

      await expect(
        screen.findByText('Введите улицу')
      ).resolves.toBeInTheDocument();
    });

    it('shows city validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');
      const user = userEvent.setup();

      await selectCountry(user);

      fireEvent.submit(form);

      await expect(
        screen.findByText('Введите название города')
      ).resolves.toBeInTheDocument();
    });

    it('shows postalCode validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');
      const user = userEvent.setup();

      await selectCountry(user);

      fireEvent.submit(form);

      await expect(
        screen.findByText(
          'Неверный адрес. Узбекистан имеет следующий формат NNN NNN'
        )
      ).resolves.toBeInTheDocument();
    });
  });

  describe('password', () => {
    it('shows error for password with leading/trailing spaces', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/пароль/i);
      await user.type(passwordInput, ' validPass123! ');

      await expect(
        screen.findByText('Уберите пробелы в начале или конце пароля')
      ).resolves.toBeInTheDocument();
    });

    it('shows password requirements errors for weak password', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);
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
  });
});
