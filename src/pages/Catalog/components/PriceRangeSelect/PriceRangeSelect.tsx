import {
  Flex,
  NumberInput,
  RangeSlider,
  RangeSliderValue,
  Skeleton,
} from '@mantine/core';
import { useField } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { Ref, useEffect, useImperativeHandle } from 'react';

export type PriceRangeSelectHandle = {
  getValue: () => { from: number; to: number };
} | null;

type Props = {
  min: number;
  max: number;
  initialValues?: { from: number; to: number };
  ref: Ref<PriceRangeSelectHandle>;
  onChange: (values: { from: number; to: number }) => void;
};

const PriceRangeSelect = ({
  min,
  max,
  initialValues,
  onChange,
  ref,
}: Props) => {
  const minField = useField<number>({
    initialValue: initialValues?.from ?? min,
  });
  const maxField = useField<number>({
    initialValue: initialValues?.to ?? max,
  });

  const [minValueDebounced] = useDebouncedValue(minField.getValue(), 400);
  const [maxValueDebounced] = useDebouncedValue(maxField.getValue(), 400);

  useEffect(() => {
    onChange({ from: minValueDebounced, to: maxValueDebounced });
  }, [minValueDebounced, maxValueDebounced]);

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
