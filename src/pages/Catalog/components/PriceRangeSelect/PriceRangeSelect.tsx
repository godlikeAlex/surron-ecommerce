import {
  Flex,
  NumberInput,
  RangeSlider,
  RangeSliderValue,
  Skeleton,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export type PriceRangeSelectHandle = {
  getValue: () => { from: number; to: number };
} | null;

type Props = {
  min: number;
  max: number;
  initialValues: { from: number; to: number };
  onChange: (values: { from: number; to: number }) => void;
};

const PriceRangeSelect = ({ min, max, initialValues, onChange }: Props) => {
  const [minValue, setMinValue] = useState<number>(initialValues?.from);
  const [maxValue, setMaxValue] = useState<number>(initialValues?.to);

  useEffect(() => {
    setMinValue(initialValues.from);
    setMaxValue(initialValues.to);
  }, [initialValues]);

  const handleDebounceChange = useDebouncedCallback(
    ([from, to]: RangeSliderValue) => onChange({ from, to }),
    500
  );

  const handleChange = (input: 'min' | 'max', value: number) => {
    if (input === 'min') {
      handleDebounceChange([value, maxValue]);
      setMinValue(value);
    } else {
      handleDebounceChange([minValue, value]);
      setMaxValue(value);
    }
  };

  const handleChangeSlider = ([min, max]: RangeSliderValue) => {
    if (min !== minValue) {
      handleChange('min', min);
    }

    if (max !== maxValue) {
      handleChange('max', max);
    }
  };

  return (
    <>
      <Flex gap={20} justify="space-between">
        <NumberInput
          onChange={(value) => handleChange('min', Number(value))}
          value={minValue}
          size="xs"
          thousandSeparator=" "
          min={min}
          max={max}
          hideControls
          prefix="₽ "
        />
        <NumberInput
          onChange={(value) => handleChange('max', Number(value))}
          value={maxValue}
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
        value={[minValue, maxValue]}
        onChange={handleChangeSlider}
        disabled={min === max}
      />
    </>
  );
};

const PriceRangeSelectSkeleton = () => (
  <>
    <Flex gap={20}>
      <Skeleton h={31} />
      <Skeleton h={31} />
    </Flex>

    <Skeleton h={15} width="100%" mt="xs"></Skeleton>
  </>
);

PriceRangeSelect.Skeleton = PriceRangeSelectSkeleton;

export { PriceRangeSelect };
