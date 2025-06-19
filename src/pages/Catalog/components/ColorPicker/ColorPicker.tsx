import { Box, Group, Skeleton } from '@mantine/core';
import classes from './ColorPicker.module.scss';

type Props = {
  colors: string[];
  onChange: (colors: string[]) => void;
  selectedColors: string[];
};

const ColorPicker = ({ colors, onChange, selectedColors }: Props) => {
  const handleSelectColor = (color: string) => {
    let updatedSelectedColors = [...selectedColors];

    if (updatedSelectedColors.includes(color)) {
      updatedSelectedColors = updatedSelectedColors.filter(
        (selectedColor) => selectedColor !== color
      );
    } else {
      updatedSelectedColors.push(color);
    }

    onChange(updatedSelectedColors);
  };

  return (
    <Group gap={5}>
      {colors.map((color) => (
        <Box
          key={color}
          className={`${classes.colorPickerButton} ${selectedColors.includes(color) && classes.colorPickerButtonActive}`}
          onClick={() => handleSelectColor(color)}
          component="button"
          aria-label={color}
          aria-pressed={selectedColors.includes(color)}
        >
          <Box
            style={{ background: color }}
            className={classes.colorPickerButtonColor}
          ></Box>
        </Box>
      ))}
    </Group>
  );
};

const ColorPickerSkeleton = () => (
  <Group gap={5}>
    {new Array(6).fill('').map((_, index) => (
      <Skeleton w={32} h={32} key={index} role="presentation"></Skeleton>
    ))}
  </Group>
);

ColorPicker.Skeleton = ColorPickerSkeleton;

export { ColorPicker };
