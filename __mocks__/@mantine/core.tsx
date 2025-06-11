export const RangeSlider = ({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number];
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
}) => {
  const [minValue, maxValue] = value;

  return (
    <>
      <input
        role="slider"
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={minValue}
        onChange={(e) => onChange([Number(e.target.value), maxValue])}
      />

      <input
        role="slider"
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={maxValue}
        onChange={(e) => onChange([minValue, Number(e.target.value)])}
      />
    </>
  );
};

export * from '@mantine/core';
