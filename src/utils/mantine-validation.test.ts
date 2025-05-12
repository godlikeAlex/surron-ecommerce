import { expect, it, describe } from 'vitest';
import {
  combineRules,
  isCorrectPostalCode,
  isDateDiffLessThan,
  isOnlyLetters,
  notMatches,
  validateEmail,
  validatePassword,
} from './mantine-validation';
import { COUNTRIES } from '@/constants/countries';
import { isNotEmpty } from '@mantine/form';

describe('combineRules mantine fn', () => {
  it('should return undefined when validation passed', () => {
    expect.hasAssertions();

    const result = combineRules([
      isNotEmpty('Cannot be empty'),
      isOnlyLetters('Accept only letters'),
    ])('Example');

    expect(result).toBeUndefined();
  });

  it('should return first error in chain', () => {
    expect.hasAssertions();

    const result = combineRules([
      isNotEmpty('Cannot be empty'),
      isOnlyLetters('Accept only letters'),
    ])('');

    expect(result).toBe('Cannot be empty');
  });

  it('should return second error in chain', () => {
    expect.hasAssertions();

    const result = combineRules([
      isNotEmpty('Cannot be empty'),
      isOnlyLetters('Accept only letters'),
    ])('123');

    expect(result).toBe('Accept only letters');
  });
});

describe('isOnlyLetters validation mantine fn', () => {
  it('should return undefined for valid string with letters', () => {
    expect.hasAssertions();

    const result = isOnlyLetters('Error Message')('asd');

    expect(result).toBeUndefined();
  });

  it('should return error message for invalid string with letters', () => {
    expect.hasAssertions();

    const errorMessage = 'Error Message';

    const result = isOnlyLetters(errorMessage)('123s$#');

    expect(result).toStrictEqual(errorMessage);
  });
});

describe('notMatches validation mantine fn', () => {
  it('should return undefined for valid pattern', () => {
    expect.hasAssertions();

    const result = notMatches(/[0-9]/, 'Error Message')('123');

    expect(result).toBeUndefined();
  });

  it('should return Error Message for invalid pattern', () => {
    expect.hasAssertions();

    const message = 'Error Message';

    const result = notMatches(/[0-9]/, 'Error Message')('asd');

    expect(result).toStrictEqual(message);
  });
});

describe('isDateDiffLessThan validation mantine fn', () => {
  it('should return undefined for greater than date', () => {
    expect.hasAssertions();

    const result = isDateDiffLessThan(
      { target: 13, unit: 'years' },
      'Error Message'
    )('05.05.2001');

    expect(result).toBeUndefined();
  });

  it('should return Error Message for less than date', () => {
    expect.hasAssertions();

    const message = 'Error Message';

    const result = isDateDiffLessThan(
      { target: 13, unit: 'years' },
      'Error Message'
    )('05.05.2022');

    expect(result).toStrictEqual(message);
  });
});

describe('isCorrectPostalCode validation mantine fn', () => {
  it('should return undefined for valid postal code', () => {
    expect.hasAssertions();

    const [country] = COUNTRIES;

    const result = isCorrectPostalCode(() => 'error message')(
      '123 123',
      country.code
    );

    expect(result).toBeUndefined();
  });

  it('should return Error Message for invalid postal code', () => {
    expect.hasAssertions();

    const [country] = COUNTRIES;

    const message = `Wrong format for ${country.code}`;

    const result = isCorrectPostalCode(() => message)('123123', country.code);

    expect(result).toStrictEqual(message);
  });
});

describe('validateEmail function', () => {
  it('should return nothing for valid email', () => {
    expect.hasAssertions();

    const result = validateEmail('example@user.com');

    expect(result).toBeNull();
  });

  it('shows error for invalid email format', () => {
    expect.hasAssertions();

    const errorMessage = 'Должен быть ровно один символ @';

    const result = validateEmail('invalid-email@@');

    expect(result).toBe(errorMessage);
  });

  it('shows error for email with leading/trailing spaces', () => {
    expect.hasAssertions();

    const errorMessage = 'Уберите пробелы в начале или конце email';

    const result = validateEmail(' user@example.com ');

    expect(result).toBe(errorMessage);
  });

  it('shows error for email without domain', () => {
    expect.hasAssertions();

    const errorMessage = 'Укажите домен после @';

    const result = validateEmail('user@');

    expect(result).toBe(errorMessage);
  });

  it('shows error for email when domain starts with dot(.)', () => {
    expect.hasAssertions();

    const errorMessage = 'Домен не может начинаться с точки';

    const result = validateEmail('user@.example');

    expect(result).toBe(errorMessage);
  });

  it('shows error for email when domain ends with dot(.)', () => {
    expect.hasAssertions();

    const errorMessage = 'Домен не может заканчиваться точкой';

    const result = validateEmail('user@example.');

    expect(result).toBe(errorMessage);
  });
});

describe('validatePassword function', () => {
  it('should return nothing for valid email password', () => {
    expect.hasAssertions();

    const result = validatePassword('12345678Az$');

    expect(result).toBeNull();
  });

  it('should return error for password with leading/trailing spaces', () => {
    expect.hasAssertions();

    const errorMessage = 'Уберите пробелы в начале или конце пароля';

    const result = validatePassword(' validPass123! ');

    expect(result).toBe(errorMessage);
  });

  it('should return error for password with length less than 8', () => {
    expect.hasAssertions();

    const errorMessage = 'Пароль должен быть не менее 8 символов';

    const result = validatePassword('12345');

    expect(result).toBe(errorMessage);
  });

  it('should return error for password without symbol [A-Z]', () => {
    expect.hasAssertions();

    const errorMessage = 'Добавьте хотя бы одну заглавную букву (A-Z)';

    const result = validatePassword('12345678');

    expect(result).toBe(errorMessage);
  });

  it('should return error for password without symbol [a-z]', () => {
    expect.hasAssertions();

    const errorMessage = 'Добавьте хотя бы одну строчную букву (a-z)';

    const result = validatePassword('12345678A');

    expect(result).toBe(errorMessage);
  });

  it('should return error for password without symbol [0-9]', () => {
    expect.hasAssertions();

    const errorMessage = 'Добавьте хотя бы одну цифру (0-9)';

    const result = validatePassword('AAAAAAAAz');

    expect(result).toBe(errorMessage);
  });

  it('should return error for password without symbol [!@#$%^&*]', () => {
    expect.hasAssertions();

    const errorMessage = 'Добавьте хотя бы один спецсимвол (!@#$%^&*)';

    const result = validatePassword('12345678Az');

    expect(result).toBe(errorMessage);
  });
});
