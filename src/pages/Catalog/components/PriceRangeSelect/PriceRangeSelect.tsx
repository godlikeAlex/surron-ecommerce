import {
  Flex,
  NumberInput,
  RangeSlider,
  RangeSliderValue,
} from '@mantine/core';
import { useField } from '@mantine/form';
import { useEffect } from 'react';

type Props = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

export const PriceRangeSelect = ({ min, max }: Props) => {
  const minField = useField<number>({
    initialValue: min,
  });
  const maxField = useField<number>({
    initialValue: max,
  });

  useEffect(() => minField.setValue(min), [min]);
  useEffect(() => maxField.setValue(max), [max]);

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
