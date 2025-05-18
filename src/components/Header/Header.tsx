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
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import classes from './Header.module.scss';
import { Link, useLocation } from 'react-router';
import logo from '@/assets/logo.png';
import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { useCallback } from 'react';

type LinkType = {
  path: string;
  label: string;
};

const buttons = [
  { path: '/registration', label: 'Регистрация' },
  { path: '/login', label: 'Вход' },
];

const links = [
  { path: '/', label: 'Главная' },
  { path: '/hyper-bee', label: 'HYPER BEE' },
  { path: '/light-bee', label: 'LIGHT BEE' },
  { path: '/ultra-bee', label: 'ULTRA BEE' },
  { path: '/shop', label: 'Магазин' },
  { path: '/about', label: 'О нас' },
];

const Header = () => {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);
  const isLoggedIn = useApiRootStore((state) => state.isLoggedIn);
  const theme = useMantineTheme();

  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isLargeScreen = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);

  const getLinkComponent = (link: LinkType, className: string) => {
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
      isMediumScreen &&
      !isSmallScreen &&
      ['/hyper-bee', '/light-bee', '/ultra-bee'].includes(link.path)
    ) {
      return null;
    }
    if (isLoggedIn && link.path === '/registration') return;
    if (isLoggedIn && link.path === '/login') return;
    return getLinkComponent(link, 'link');
  });

  const buttonComponents = buttons.map((button) => {
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
            withCloseButton={false}
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
            </Flex>
          </Modal>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
