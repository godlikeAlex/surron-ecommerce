import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, userEvent } from '@/tests/utils';
import RegistrationForm from './RegistrationForm';
import { UserEvent } from '@testing-library/user-event';
import { COUNTRIES } from '@/constants/countries';

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

  it('should render address inputs', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const cityInput = screen.getByLabelText(/город/i);
    const street = screen.getByLabelText(/улица/i);
    const postalAddressInput = screen.getByLabelText(/почтовый адрес/i);
    const countryInput = screen.getByPlaceholderText(/Выбрать страну/i);

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
    it('shows email validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');

      fireEvent.submit(form);

      await expect(
        screen.findByText('Введите верный email (user@example.com)')
      ).resolves.toBeInTheDocument();
    });

    it('shows error when email is invalid', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const emailInput = screen.getByLabelText(/email/i);

      const user = userEvent.setup();

      await user.type(emailInput, 'w@rong@c.q');

      await expect(
        screen.findByText('Введите верный email (user@example.com)')
      ).resolves.toBeInTheDocument();
    });
  });

  it('shows password validation error when is empty', async () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    await expect(
      screen.findByText('Пароль должен содержать 8 символов.')
    ).resolves.toBeInTheDocument();
  });

  it('shows firstName validation error when is empty', async () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    await expect(
      screen.findByText('Имя должно быть заполнено.')
    ).resolves.toBeInTheDocument();
  });

  it('shows lastName validation error when is empty', async () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const form = screen.getByTestId('registration-form');

    fireEvent.submit(form);

    await expect(
      screen.findByText('Фамилия должно быть заполнено.')
    ).resolves.toBeInTheDocument();
  });

  describe('dateOfBirth', () => {
    it('shows dateOfBirth validation error when is empty', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const form = screen.getByTestId('registration-form');

      fireEvent.submit(form);

      await expect(
        screen.findByText('Выберите дату.')
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
        screen.findByText('Выберите вашу страну.')
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
        screen.findByText('Введите улицу.')
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
        screen.findByText('Введите название города.')
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
    it('shows error when password length less than 8', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);

      const user = userEvent.setup();

      await user.type(passwordInput, '1234');

      await expect(
        screen.findByText('Пароль должен содержать 8 символов.')
      ).resolves.toBeInTheDocument();
    });

    it('shows error when password not contains (A-Z)', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);

      const user = userEvent.setup();

      await user.type(passwordInput, '12345678');

      await expect(
        screen.findByText(
          'Пароль должен содержать хотя-бы 1 заглавную букву. (A-Z)'
        )
      ).resolves.toBeInTheDocument();
    });

    it('shows error when password not contains (a-z)', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);

      const user = userEvent.setup();

      await user.type(passwordInput, '12345678A');

      await expect(
        screen.findByText(
          'Пароль должен содержать хотя-бы 1 строчную букву. (a-z)'
        )
      ).resolves.toBeInTheDocument();
    });

    it('shows error when password not contains (0-9)', async () => {
      expect.hasAssertions();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);

      const user = userEvent.setup();

      await user.type(passwordInput, 'AAAAAAAa');

      await expect(
        screen.findByText('Пароль должен содержать хотя-бы 1 цифру')
      ).resolves.toBeInTheDocument();
    });
  });
});
