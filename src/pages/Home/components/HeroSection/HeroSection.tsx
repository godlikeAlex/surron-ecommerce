import { Center, Text, useMantineTheme, Container } from '@mantine/core';
import classes from './HeroSection.module.scss';
import { useMediaQuery } from '@mantine/hooks';

export const HeroSection = () => {
  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);

  return (
    <Container className={classes.heroContainer} style={{ maxWidth: '1280px' }}>
      <Center>
        <Text
          size={isLargeScreen ? '34' : '24'}
          fw={900}
          variant="gradient"
          gradient={{ from: 'pink', to: 'yellow', deg: 90 }}
        >
          Добро пожаловать на сайт
        </Text>
      </Center>
      <Center>
        <Text size={'16'} fw={600} c="black">
          Воспользуйтесь нашим промокодом:
        </Text>
      </Center>
      <Center>
        <Text size={'36'} fw={600} c="red">
          PROMO
        </Text>
      </Center>
    </Container>
  );
};
