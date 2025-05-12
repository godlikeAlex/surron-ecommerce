import { POSTAL_CODES } from '@/constants/postal-codes';
import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import { isEmail as mantineIsEmail } from '@mantine/form';

type ValidationFunction = (value: unknown) => React.ReactNode;

export const combineRules = (
  rules: ValidationFunction[]
): ValidationFunction => {
  return (value: unknown): React.ReactNode => {
    for (const rule of rules) {
      const error = rule(value);

      if (error) return error;
    }
  };
};

export const notMatches =
  (regexp: RegExp, error: React.ReactNode): ValidationFunction =>
  (value: unknown) => {
    if (typeof value !== 'string') return error;

    if (!regexp.test(value)) {
      return error;
    }
  };

export const isOnlyLetters =
  (error: React.ReactNode): ValidationFunction =>
  (value: unknown) => {
    if (typeof value !== 'string') return error;

    if (!/^[A-Za-zА-Яа-яЁё]+$/.test(value)) return error;
  };

export const isDateDiffLessThan =
  (
    { target, unit }: { target: number; unit: QUnitType | OpUnitType },
    error: React.ReactNode
  ): ValidationFunction =>
  (value: unknown) => {
    if (typeof value !== 'string') return error;

    const diff = dayjs(Date.now()).diff(dayjs(value), unit);

    if (diff < target) return error;
  };

export const isCorrectPostalCode =
  (error: (countryName: string, format: string) => React.ReactNode) =>
  (value: unknown, currentCountryCode?: string) => {
    if (typeof value !== 'string') return;

    const targetPostalCode = POSTAL_CODES.find(
      (postalCode) => postalCode.iso === currentCountryCode
    );

    if (!targetPostalCode) return true; // Если нет почтового кода, разрешаем любой

    if (!targetPostalCode.regex.test(value)) {
      return error(targetPostalCode.countryName, targetPostalCode.format);
    }
  };

export const validateEmail = (value: string) => {
  const trimmed = value.trim();

  if (trimmed !== value) return 'Уберите пробелы в начале или конце email';
  if (!value.includes('@')) return 'Email должен содержать @';
  if (value.split('@').length !== 2) return 'Должен быть ровно один символ @';

  const [, domain] = value.split('@');
  if (!domain) return 'Укажите домен после @';
  if (!domain.includes('.'))
    return 'Домен должен содержать точку (например: example.com)';
  if (domain.startsWith('.')) return 'Домен не может начинаться с точки';
  if (domain.endsWith('.')) return 'Домен не может заканчиваться точкой';

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return 'Некорректный формат email (пример: user@example.com)';
  }

  return mantineIsEmail('Некорректный формат email (пример: user@example.com)')(
    value
  );
};

export const validatePassword = (value: string) => {
  const trimmed = value.trim();

  if (trimmed !== value) return 'Уберите пробелы в начале или конце пароля';
  if (value.length < 8) return 'Пароль должен быть не менее 8 символов';
  if (!/[A-Z]/.test(value))
    return 'Добавьте хотя бы одну заглавную букву (A-Z)';
  if (!/[a-z]/.test(value)) return 'Добавьте хотя бы одну строчную букву (a-z)';
  if (!/[0-9]/.test(value)) return 'Добавьте хотя бы одну цифру (0-9)';
  if (!/[!@#$%^&*]/.test(value))
    return 'Добавьте хотя бы один спецсимвол (!@#$%^&*)';
  return null;
};
