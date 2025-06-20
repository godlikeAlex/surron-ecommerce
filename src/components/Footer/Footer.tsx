import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons-react';
import { ActionIcon, Anchor, Flex, Group, Image, Title } from '@mantine/core';
import classes from './Footer.module.scss';
import logo from '@/assets/logo.png';
import { Link } from 'react-router';

const links = [
  { link: '/', label: 'Главная' },
  { link: '/about', label: 'О нас' },
  { link: '/catalog', label: 'Магазин' },
  { link: '/cart', label: 'Корзина' },
  { link: '/profile', label: 'Аккаунт' },
];

export const Footer = () => {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      component={Link}
      key={link.label}
      to={link.link}
      lh={1}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Flex align="center" gap={10}>
          <Image src={logo} alt="Surron Ecommerce" style={{ width: '35px' }} />

          <Title order={4}>Surron Ecommerce</Title>
        </Flex>

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
};
