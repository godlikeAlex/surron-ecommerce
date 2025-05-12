import { POSTAL_CODES } from '@/constants/postal-codes';
import dayjs, { OpUnitType, QUnitType } from 'dayjs';
import React from 'react';

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
