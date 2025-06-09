import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import RegistrationForm, { FormValues } from './RegistrationForm';
import { UserEvent } from '@testing-library/user-event';
import { COUNTRIES } from '@/constants/countries';

vi.mock('@mantine/dates');

const handleSignupMock = vi.fn<(data: FormValues) => Promise<void>>();

vi.mock('./useSignupUser', () => ({
  useSignupUser: () => ({
    handleSignup: handleSignupMock,
    isPending: false,
    error: false,
  }),
}));

async function selectCountry(user: UserEvent, path: string) {
  const [country] = COUNTRIES;

  await user.click(screen.getByTestId(`${path}-country`));

  for (const option of screen.getAllByText(`${country.flag} ${country.name}`)) {
    await user.click(option);
  }
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

  it('should not invoke submit handler when validation not passed', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    expect(handleSignupMock).not.toHaveBeenCalled();
  });

  it('should invoke submit handler when validation passed', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    const firstNameInput = screen.getByLabelText(/имя/i);
    const lastNameInput = screen.getByLabelText(/фамилия/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const dateOfBirth = screen.getByLabelText(/дата рождения/i);

    const street = screen.getByTestId('address-street');
    const cityInput = screen.getByTestId('address-city');
    const postalAddressInput = screen.getByTestId('address-postalCode');

    await user.type(emailInput, 'user@example.com');
    await user.type(firstNameInput, 'Aleksandr');
    await user.type(lastNameInput, 'Yurkovskiy');
    await user.type(passwordInput, '123456Sss$');
    await user.type(dateOfBirth, '2001-05-05');

    await selectCountry(user, 'address');

    await user.type(street, 'Улица Гагарина');
    await user.type(cityInput, 'Самарканд');
    await user.type(postalAddressInput, '666 666');

    await user.click(
      screen.getByLabelText(/использовать адрес для выставления счета/i)
    );

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    expect(handleSignupMock).toHaveBeenCalledWith({
      address: {
        city: 'Самарканд',
        country: 'UZ',
        postalCode: '666 666',
        streetName: 'Улица Гагарина',
        useAsBilling: true,
        useAsDefault: false,
      },
      billing: {
        city: 'Самарканд',
        country: 'UZ',
        postalCode: '666 666',
        streetName: 'Улица Гагарина',
        useAsDefault: false,
      },
      dateOfBirth: '2001-05-05',
      email: 'user@example.com',
      firstName: 'Aleksandr',
      lastName: 'Yurkovskiy',
      password: '123456Sss$',
    });
  });

  it('should render address inputs', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const countryInput = screen.getByTestId('address-country');
    const street = screen.getByTestId('address-street');
    const cityInput = screen.getByTestId('address-city');
    const postalAddressInput = screen.getByTestId('address-postalCode');

    expect(cityInput).toBeInTheDocument();
    expect(street).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(postalAddressInput).toBeInTheDocument();
  });

  it('should render billing address inputs', () => {
    expect.hasAssertions();

    render(<RegistrationForm />);

    const countryInput = screen.getByTestId('billing-country');
    const street = screen.getByTestId('billing-street');
    const cityInput = screen.getByTestId('billing-city');
    const postalAddressInput = screen.getByTestId('billing-postalCode');

    expect(cityInput).toBeInTheDocument();
    expect(street).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(postalAddressInput).toBeInTheDocument();
  });

  it('shipping address street, city, postal code is disabled when country empty', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    const street = screen.getByTestId('address-street');
    const cityInput = screen.getByTestId('address-city');
    const postalAddressInput = screen.getByTestId('address-postalCode');

    expect(cityInput).toBeDisabled();
    expect(postalAddressInput).toBeDisabled();
    expect(street).toBeDisabled();
  });

  it('billing address street, city, postal code is disabled when country empty', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    const street = screen.getByTestId('billing-street');
    const cityInput = screen.getByTestId('billing-city');
    const postalAddressInput = screen.getByTestId('billing-postalCode');

    expect(cityInput).toBeDisabled();
    expect(postalAddressInput).toBeDisabled();
    expect(street).toBeDisabled();
  });
});

describe('validation component RegistrationForm', () => {
  describe('email', () => {
    it('shows error for invalid email format', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, 'invalid-email');

      expect(screen.getByText('Email должен содержать @')).toBeInTheDocument();

      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email@@');

      expect(
        screen.getByText('Должен быть ровно один символ @')
      ).toBeInTheDocument();
    });

    it('shows error for email with leading/trailing spaces', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, '  user@example.com  ');

      expect(
        screen.getByText('Уберите пробелы в начале или конце email')
      ).toBeInTheDocument();
    });

    it('shows error for email without domain', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'user@');

      expect(screen.getByText('Укажите домен после @')).toBeInTheDocument();
    });

    it('shows error for email with invalid domain format', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, 'user@example.');

      expect(
        screen.getByText('Домен не может заканчиваться точкой')
      ).toBeInTheDocument();

      await user.clear(emailInput);
      await user.type(emailInput, 'user@.example');

      expect(
        screen.getByText('Домен не может начинаться с точки')
      ).toBeInTheDocument();
    });
  });

  it('shows firstName validation error when is empty', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    expect(screen.getByText('Имя должно быть заполнено')).toBeInTheDocument();
  });

  it('shows lastName validation error when is empty', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i })
    );

    expect(
      screen.getByText('Фамилия должна быть заполнена')
    ).toBeInTheDocument();
  });

  describe('dateOfBirth', () => {
    it('shows dateOfBirth validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      await user.click(
        screen.getByRole('button', { name: /зарегистрироваться/i })
      );

      expect(screen.getByText('Выберите дату')).toBeInTheDocument();
    });

    it('shows dateOfBirth validation error when entered under 13 years', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);
      await user.type(screen.getByLabelText(/дата рождения/i), '2020-05-05');

      expect(
        screen.getByText(
          'Чтобы пользоваться нашим сайтом, вы должны быть старше 13 лет'
        )
      ).toBeInTheDocument();
    });
  });

  describe('address', () => {
    it('shows both country validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      await user.click(
        screen.getByRole('button', { name: /зарегистрироваться/i })
      );

      expect(screen.getAllByText('Выберите вашу страну')).toHaveLength(2);
    });

    it('shows street validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const streetInput = screen.getByTestId('address-street');

      await selectCountry(user, 'address');
      await user.type(streetInput, 'test');
      await user.clear(streetInput);

      expect(screen.getByText('Введите улицу')).toBeInTheDocument();
    });

    it('shows city validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const cityInput = screen.getByTestId('address-city');

      await selectCountry(user, 'address');
      await user.type(cityInput, 'test');
      await user.clear(cityInput);

      expect(screen.getByText('Введите название города')).toBeInTheDocument();
    });

    it('shows postalCode validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const postalCodeInput = screen.getByTestId('address-postalCode');

      await selectCountry(user, 'address');
      await user.type(postalCodeInput, 'test');

      expect(
        screen.getByText(
          'Неверный адрес. Узбекистан имеет следующий формат NNN NNN'
        )
      ).toBeInTheDocument();
    });
  });

  describe('billing address', () => {
    it('shows both country validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      await user.click(
        screen.getByRole('button', { name: /зарегистрироваться/i })
      );

      expect(screen.getAllByText('Выберите вашу страну')).toHaveLength(2);
    });

    it('shows street validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const streetInput = screen.getByTestId('billing-street');

      await selectCountry(user, 'billing');
      await user.type(streetInput, 'test');
      await user.clear(streetInput);

      expect(screen.getByText('Введите улицу')).toBeInTheDocument();
    });

    it('shows city validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const cityInput = screen.getByTestId('billing-city');

      await selectCountry(user, 'billing');
      await user.type(cityInput, 'test');
      await user.clear(cityInput);

      expect(screen.getByText('Введите название города')).toBeInTheDocument();
    });

    it('shows postalCode validation error when is empty', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const postalCodeInput = screen.getByTestId('billing-postalCode');

      await selectCountry(user, 'billing');
      await user.type(postalCodeInput, 'test');

      expect(
        screen.getByText(
          'Неверный адрес. Узбекистан имеет следующий формат NNN NNN'
        )
      ).toBeInTheDocument();
    });
  });

  describe('password', () => {
    it('shows error for password with leading/trailing spaces', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);
      await user.type(passwordInput, ' validPass123! ');

      expect(
        screen.getByText('Уберите пробелы в начале или конце пароля')
      ).toBeInTheDocument();
    });

    it('shows password requirements errors for weak password', async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(<RegistrationForm />);

      const passwordInput = screen.getByLabelText(/пароль/i);
      await user.type(passwordInput, 'simple');

      expect(
        screen.getByText('Пароль должен быть не менее 8 символов')
      ).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, 'simplepa');

      expect(
        screen.getByText('Добавьте хотя бы одну заглавную букву (A-Z)')
      ).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, 'SIMPLEPASS');

      expect(
        screen.getByText('Добавьте хотя бы одну строчную букву (a-z)')
      ).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, 'simplePass');

      expect(
        screen.getByText('Добавьте хотя бы одну цифру (0-9)')
      ).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, 'simplePass1');

      expect(
        screen.getByText('Добавьте хотя бы один спецсимвол (!@#$%^&*)')
      ).toBeInTheDocument();
    });
  });
});
