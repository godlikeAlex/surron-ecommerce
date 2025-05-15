import {
  Burger,
  Container,
  Group,
  Image,
  Flex,
  Title,
  Button,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.scss';
import { Link, useLocation } from 'react-router';
import logo from '@/assets/logo.png';
import { apiRootStore, useApiRootStore } from '@/store/apiRootStore';
import { useCallback, useRef } from 'react';

const links = [
  { link: '/', label: 'Главная' },
  { link: '/registration', label: 'Регистрация' },
  { link: '/login', label: 'Вход' },
];

const Header = () => {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure(false);
  const isLoggedIn = useApiRootStore((state) => state.isLoggedIn);
  const burgerRef = useRef(null);

  const items = links.map((link) => {
    if (isLoggedIn && link.link === '/registration') return;
    if (isLoggedIn && link.link === '/login') return;
    return (
      <Link
        to={link.link}
        key={link.label}
        className={classes.link}
        data-active={location.pathname === link.link}
      >
        {link.label}
      </Link>
    );
  });

  const handleLogout = useCallback(() => {
    apiRootStore().setLogout();
    void apiRootStore().obtainToken();
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
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Flex gap={10} justify="center" align="center">
            <Image src={logo} className={classes.logo} w={28} />
            <Title order={4}>Surron Ecommerce</Title>
          </Flex>
          <Group gap={10} visibleFrom="sm">
            {items}
            {logoutButton}
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
            ref={burgerRef}
          />
          <Modal
            opened={opened}
            onClose={toggle}
            title="This is a fullscreen modal"
            fullScreen
            radius={0}
            transitionProps={{ transition: 'fade', duration: 300 }}
            onClick={toggle}
            hiddenFrom="sm"
          >
            <Flex
              gap={10}
              hiddenFrom="sm"
              direction="column"
              className={classes.fullscreenMenu}
              justify="center"
              align="center"
            >
              {items}
              {logoutButton}
            </Flex>
          </Modal>
        </div>
      </Container>
    </header>
  );
};

export default Header;
