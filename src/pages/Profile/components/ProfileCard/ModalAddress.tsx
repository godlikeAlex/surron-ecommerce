import { COUNTRIES } from '@/constants/countries';
import { AddressPickerInputs } from '@/pages/Registration/components/AddressPicker';
import {
  combineRules,
  isOnlyLetters,
  validatePostalCode,
} from '@/utils/mantine-validation';
import {
  Box,
  Button,
  Flex,
  Grid,
  Loader,
  Select,
  TextInput,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useMemo } from 'react';
import { useProfileEdit } from './useProfileEdit';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import classes from './ProfileCard.module.scss';

type VoidFunction = () => void;
export type AddressWithId = AddressPickerInputs & { id: string };

export const ModalAddress = ({
  close,
  submitType,
  addressWithId,
}: {
  close: VoidFunction;
  submitType: number;
  addressWithId: AddressWithId;
}) => {
  const { isPending: isPendingEdit, mutateAsync } = useProfileEdit();

  const handleSubmitAddress = async (values: AddressPickerInputs) => {
    if (submitType === 1) {
      const actions: MyCustomerUpdateAction[] = [
        {
          action: 'addAddress',
          address: {
            city: values.city,
            country: values.country,
            postalCode: values.postalCode,
            streetName: values.streetName,
          },
        },
      ];
      await mutateAsync(actions);
      await mutateAsync([{ action: 'addShippingAddressId', addressId: '' }]);
      close();
    } else if (submitType === 2) {
      const actions: MyCustomerUpdateAction[] = [
        {
          action: 'addAddress',
          address: {
            city: values.city,
            country: values.country,
            postalCode: values.postalCode,
            streetName: values.streetName,
          },
        },
      ];
      await mutateAsync(actions);
      await mutateAsync([{ action: 'addBillingAddressId', addressId: '' }]);
      close();
    } else if (submitType === 3) {
      const actions: MyCustomerUpdateAction[] = [
        {
          action: 'changeAddress',
          address: {
            city: values.city,
            country: values.country,
            postalCode: values.postalCode,
            streetName: values.streetName,
          },
          addressId: addressWithId.id,
        },
      ];
      await mutateAsync(actions);
      close();
    }
  };

  const formAddress = useForm<AddressPickerInputs>({
    initialValues: {
      streetName: addressWithId.streetName,
      city: addressWithId.city,
      postalCode: addressWithId.postalCode,
      country: addressWithId.country,
    },
    validate: {
      streetName: isNotEmpty('Введите улицу'),
      city: combineRules([
        isNotEmpty('Введите название города'),
        isOnlyLetters('Город должен содержать только буквы'),
      ]),
      postalCode: (postalCode, { country }) =>
        validatePostalCode(postalCode, country),
      country: isNotEmpty('Выберите вашу страну'),
    },
    validateInputOnChange: true,
  });

  const countries = useMemo(() => {
    return COUNTRIES.map(({ code, name, flag }) => ({
      value: code,
      label: `${flag} ${name}`,
    }));
  }, []);

  formAddress.watch('country', () => {
    if (formAddress.getValues().postalCode.length > 0)
      formAddress.validateField('postalCode');
  });

  return (
    <Box component="form" onSubmit={formAddress.onSubmit(handleSubmitAddress)}>
      <Grid>
        <Grid.Col span={6}>
          <Select
            label="Страна"
            withAsterisk
            searchable
            data={countries}
            {...formAddress.getInputProps(`country`)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Город"
            placeholder="Введите город"
            data-testid={`city`}
            withAsterisk
            {...formAddress.getInputProps(`city`)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Улица"
            placeholder="Введите улицу"
            data-testid={`street`}
            withAsterisk
            {...formAddress.getInputProps(`streetName`)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Почтовый адрес"
            placeholder="Введите почтовый адрес"
            data-testid={`postalCode`}
            withAsterisk
            {...formAddress.getInputProps(`postalCode`)}
          />
        </Grid.Col>
      </Grid>

      <Flex gap={10} wrap="wrap">
        <Button
          type="submit"
          className={classes.profileButton}
          disabled={isPendingEdit}
          style={{ flexGrow: '1', marginTop: '10px' }}
        >
          {isPendingEdit ? <Loader size="sm" color="white" /> : 'Сохранить'}
        </Button>
      </Flex>
    </Box>
  );
};
