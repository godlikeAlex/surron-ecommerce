import { expect, it, describe } from 'vitest';
import {
  combineRules,
  isCorrectPostalCode,
  isDateDiffLessThan,
  isOnlyLetters,
  notMatches,
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
