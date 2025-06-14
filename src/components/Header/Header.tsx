import {
  Burger,
  Container,
  Group,
  Image,
  Flex,
  Title,
  Button,
  Modal,
  useMantineTheme,
  Box,
  UnstyledButton,
  Text,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import classes from './Header.module.scss';
import { Link, useLocation } from 'react-router';
import logo from '@/assets/logo.png';
import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { useCallback } from 'react';
import { IconBasket } from '@tabler/icons-react';

type LinkType = {
  path: string;
  label: string;
};

const buttons = [
  { path: '/registration', label: 'Регистрация' },
  { path: '/login', label: 'Вход' },
  { path: '/profile', label: 'Профиль' },
];

const links = [
  { path: '/', label: 'Главная' },
  { path: '/catalog/sur-ron-hyper-bee', label: 'HYPER BEE' },
  { path: '/catalog/sur-ron-light-bee-2025', label: 'LIGHT BEE' },
  { path: '/catalog/sur-ron-ultra-bee', label: 'ULTRA BEE' },
  { path: '/catalog', label: 'Магазин' },
  { path: '/about', label: 'О нас' },
];

const Header = () => {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);
  const isLoggedIn = useApiRootStore((state) => state.isLoggedIn);
  const totalCart = useApiRootStore((state) => state.totalCart);
  const theme = useMantineTheme();

  const isLargeScreen = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const isBetweenSmAndMd = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`
  );

  const a = { title: 'Taxes', icon: IconBasket, color: '#d4b300' };

  const getLinkComponent = (
    link: LinkType,
    className: keyof typeof classes
  ) => {
    return (
      <Link
        to={link.path}
        key={link.label}
        className={classes[className]}
        data-active={location.pathname === link.path}
        onClick={() => opened && toggle()}
      >
        {link.label}
      </Link>
    );
  };

  const linkComponents = links.map((link) => {
    if (
      isBetweenSmAndMd &&
      [
        '/catalog/sur-ron-hyper-bee',
        '/catalog/sur-ron-light-bee-2025',
        '/catalog/sur-ron-ultra-bee',
      ].includes(link.path)
    ) {
      return null;
    }
    return getLinkComponent(link, 'link');
  });

  const buttonComponents = buttons.map((button) => {
    if (isLoggedIn && button.path === '/registration') return;
    if (isLoggedIn && button.path === '/login') return;
    if (!isLoggedIn && button.path === '/profile') return;
    return getLinkComponent(button, 'button');
  });

  const handleLogout = useCallback(() => {
    void apiRootStore().setLogout();
  }, []);

  const logoutButton = isLoggedIn && (
    <Button
      className={classes.logoutButton}
      type="button"
      onClick={handleLogout}
    >
      Выход
    </Button>
  );

  return (
    <Box component="header" className={classes.header}>
      <Container size="xl">
        <Box className={classes.inner}>
          <Flex
            gap={10}
            justify="center"
            align="center"
            component={Link}
            to="/"
            className={classes.logo}
          >
            <Image src={logo} className={classes.logoImg} w={28} />

            <Title order={4}>Surron Ecommerce</Title>
          </Flex>
          <Group gap={isLargeScreen ? 0 : 22} visibleFrom="sm">
            {linkComponents}
          </Group>

          <Group gap={isLargeScreen ? 0 : 10} visibleFrom="sm">
            {buttonComponents}
            {logoutButton}
            <Link to="/cart">
              <UnstyledButton w={40}>
                <Text
                  size="xs"
                  mt={7}
                  c="black"
                  fw={800}
                  ta={'center'}
                  style={{ transform: 'translate(5px, 0px)' }}
                >
                  {totalCart ? totalCart : null}
                </Text>
                <a.icon
                  color={a.color}
                  style={{ transform: 'scale(1.5) translate(11.5px, -2px)' }}
                />
              </UnstyledButton>
            </Link>
          </Group>

          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />

          <Modal
            opened={opened}
            onClose={toggle}
            fullScreen
            withCloseButton={false}
            radius={0}
            transitionProps={{ transition: 'fade', duration: 300 }}
            hiddenFrom="sm"
          >
            <Flex
              gap={10}
              direction="column"
              className={classes.fullscreenMenu}
              justify="center"
              align="center"
            >
              {linkComponents}
              {buttonComponents}
              {logoutButton}
              <Link to="/cart" className={classes.button} onClick={toggle}>
                Корзина({totalCart})
              </Link>
            </Flex>
          </Modal>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
