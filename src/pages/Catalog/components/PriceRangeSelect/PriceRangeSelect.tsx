import {
  Flex,
  NumberInput,
  RangeSlider,
  RangeSliderValue,
} from '@mantine/core';
import { useField } from '@mantine/form';
import { Ref, useEffect, useImperativeHandle } from 'react';

export type PriceRangeSelectHandle = {
  getValue: () => { from: number; to: number };
} | null;

type Props = {
  min: number;
  max: number;
  initialValues?: { from: number; to: number };
  ref: Ref<PriceRangeSelectHandle>;
};

export const PriceRangeSelect = ({ min, max, initialValues, ref }: Props) => {
  const minField = useField<number>({
    initialValue: initialValues?.from ?? min,
  });
  const maxField = useField<number>({
    initialValue: initialValues?.to ?? max,
  });

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => ({
        from: minField.getValue(),
        to: maxField.getValue(),
      }),
    }),
    [minField, maxField]
  );

  useEffect(
    () => minField.setValue(initialValues?.from ?? min),
    [min, initialValues?.from]
  );
  useEffect(
    () => maxField.setValue(initialValues?.to ?? max),
    [max, initialValues?.to]
  );

  const handleChangeSlider = ([min, max]: RangeSliderValue) => {
    minField.setValue(min);
    maxField.setValue(max);
  };

  return (
    <>
      <Flex gap={20} justify="space-between">
        <NumberInput
          {...minField.getInputProps()}
          size="xs"
          thousandSeparator=" "
          min={min}
          max={max}
          hideControls
          prefix="₽ "
        />
        <NumberInput
          {...maxField.getInputProps()}
          size="xs"
          thousandSeparator
          min={min}
          max={max}
          hideControls
          prefix="₽ "
        />
      </Flex>
      <RangeSlider
        mt="xs"
        label={null}
        minRange={100}
        min={min}
        max={max}
        step={100}
        defaultValue={[min, max]}
        value={[+minField.getValue(), +maxField.getValue()]}
        onChange={handleChangeSlider}
        disabled={min === max}
      />
    </>
  );
};
