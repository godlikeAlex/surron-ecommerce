import { AuthLayout } from '@/layouts';
import { Box, Center, Text } from '@mantine/core';
import { Link } from 'react-router';
import classes from './EmptyCart.module.scss';

export const EmptyCart = () => {
  return (
    <AuthLayout>
      <AuthLayout.Card title="Корзина">
        <Box className={classes.cartContainer}>
          <Text ta="center" size="md" lh={2}>
            Корзина пуста, выберите что-нибудь из нашего
          </Text>
          <Center>
            <Link to="/catalog" className={classes.link}>
              каталога
            </Link>
          </Center>
        </Box>
      </AuthLayout.Card>
    </AuthLayout>
  );
};
