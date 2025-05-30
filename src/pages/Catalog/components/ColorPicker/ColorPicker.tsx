import { Box, Group } from '@mantine/core';
import classes from './ColorPicker.module.scss';
import { useState } from 'react';

type Props = {
  colors: string[];
};

export const ColorPicker = ({ colors }: Props) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleSelectColor = (color: string) => {
    let updatedSelectedColors = [...selectedColors];

    if (updatedSelectedColors.includes(color)) {
      updatedSelectedColors = updatedSelectedColors.filter(
        (selectedColor) => selectedColor !== color
      );
    } else {
      updatedSelectedColors.push(color);
    }

    setSelectedColors(updatedSelectedColors);
  };

  return (
    <Group gap={5}>
      {colors.map((color) => (
        <Box
          key={color}
          className={`${classes.colorPickerButton} ${selectedColors.includes(color) && classes.colorPickerButtonActive}`}
          onClick={() => handleSelectColor(color)}
          component="button"
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
