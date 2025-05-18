import { Flex, Center, Text } from '@mantine/core';
import classes from './HeroSection.module.scss';

export const HeroSection = () => {
  return (
    <Flex className={classes.heroContainer} justify="center" align="center">
      <Center>
        <Text
          size="34"
          fw={900}
          variant="gradient"
          gradient={{ from: 'pink', to: 'yellow', deg: 90 }}
        >
          Добро пожаловать на сайт
        </Text>
      </Center>
    </Flex>
  );
};
