import { Flex, Center, Text, useMantineTheme, Container } from '@mantine/core';
import classes from './HeroSection.module.scss';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router';

const links = [
  { path: '/', label: 'Главная' },
  { path: '/registration', label: 'Регистрация' },
  { path: '/login', label: 'Вход' },
  { path: '/hyper-bee', label: 'HYPER BEE' },
  { path: '/light-bee', label: 'LIGHT BEE' },
  { path: '/ultra-bee', label: 'ULTRA BEE' },
  { path: '/catalog', label: 'Магазин' },
  { path: '/about', label: 'О нас' },
  { path: '/profile', label: 'Профиль' },
];

const linkItems = links.map((link) => {
  return (
    <Link to={link.path} className={classes.heroLink} key={link.label}>
      {link.label}
    </Link>
  );
});

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
        <Text size={isLargeScreen ? '22' : '16'} fw={900} c="black">
          Наши страницы:
        </Text>
      </Center>
      <Flex justify="center" align="center" gap={20} wrap={'wrap'}>
        {linkItems}
      </Flex>
    </Container>
  );
};
