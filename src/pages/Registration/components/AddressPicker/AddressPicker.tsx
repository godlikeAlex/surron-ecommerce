import { COUNTRIES } from '@/constants/countries';
import { Grid, Select, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useMemo } from 'react';

export type AddressPickerInputs = {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
};

interface Props<T> {
  path: string;
  form: UseFormReturnType<T>;
  disabled?: boolean;
}

export const AddressPicker = <T,>({
  form,
  path,
  disabled = false,
}: Props<T>) => {
  const { validateField, getInputProps } = form;

  form.watch(`${path}.country`, () => {
    if (form.getInputProps(`${path}.postalCode`).value) {
      validateField(`${path}.postalCode`);
    }
  });

  const isCountrySelected = Boolean(getInputProps(`${path}.country`).value);
  const dependedInputsDisabled = !isCountrySelected || disabled;

  const countries = useMemo(() => {
    return COUNTRIES.map(({ code, name, flag }) => ({
      value: code,
      label: `${flag} ${name}`,
    }));
  }, []);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Select
          label="Страна"
          placeholder="Выберите страну"
          withAsterisk
          searchable
          data={countries}
          disabled={disabled}
          {...form.getInputProps(`${path}.country`)}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <TextInput
          label="Город"
          placeholder="Введите город"
          withAsterisk
          disabled={dependedInputsDisabled}
          {...form.getInputProps(`${path}.city`)}
          {...(dependedInputsDisabled ? { error: undefined } : undefined)}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <TextInput
          label="Улица"
          placeholder="Введите улицу"
          withAsterisk
          disabled={dependedInputsDisabled}
          {...form.getInputProps(`${path}.streetName`)}
          {...(dependedInputsDisabled ? { error: undefined } : undefined)}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <TextInput
          label="Почтовый адрес"
          placeholder="Введите почтовый адрес"
          withAsterisk
          disabled={dependedInputsDisabled}
          {...form.getInputProps(`${path}.postalCode`)}
          {...(dependedInputsDisabled ? { error: undefined } : undefined)}
        />
      </Grid.Col>
    </Grid>
  );
};

export default AddressPicker;
