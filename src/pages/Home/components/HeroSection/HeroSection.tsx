import { Box, Center, Text } from '@mantine/core';
import classes from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <Box className={classes.heroContainer}>
      <Center>
        <Text size="xl" fw={900} variant="gradient">
          Welcome to our website
        </Text>
      </Center>
    </Box>
  );
};

export default HeroSection;
