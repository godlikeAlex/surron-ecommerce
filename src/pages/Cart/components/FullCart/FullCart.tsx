import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Text,
  TextInput,
} from '@mantine/core';
import classes from './FullCart.module.scss';
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';
import { CartCard } from '../CartCard/CartCard';
import { useUpdateCart } from '../../hooks/useUpdateCart';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useCartDelete } from '@/pages/ProductDetail/hooks/useCartDelete';
import { usePromo } from '../../hooks/usePromo';
import { useState } from 'react';

export const FullCart = ({
  data,
  refetch,
}: {
  data: Cart[];
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Cart[], Error>>;
}) => {
  const { isPending, mutateAsync } = useUpdateCart(refetch);
  const { isPending: isPendingPromo, mutateAsync: promoAsync } =
    usePromo(refetch);
  const { deleteCart, isPending: isPendingDelete } = useCartDelete();
  const [value, setValue] = useState('');

  const handleMutation = async () => {
    const response = await refetch();
    const id = response.data?.[0].id || '';
    const version = response.data?.[0].version || 1;
    await deleteCart({ id, version });
    await refetch();
  };

  const applyPromo = async () => {
    const response = await refetch();
    const id = response.data?.[0].id || '';
    const version = response.data?.[0].version || 1;
    const actions: CartUpdateAction[] = [
      { action: 'addDiscountCode', code: value },
    ];
    try {
      await promoAsync({ actions, cartId: id, cartVersion: version });
    } catch (e) {
      if (e) console.log();
    }
  };

  return (
    <Skeleton visible={isPending || isPendingDelete || isPendingPromo}>
      <Container py="xl" className={classes.fullCartContainer} size={1200}>
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 'sm', sm: 'md' }}
        >
          {data[0].lineItems.map((item) => (
            <CartCard
              key={item.id}
              data={item}
              mutateAsync={mutateAsync}
              refetch={refetch}
            />
          ))}
        </SimpleGrid>
        <Divider my="sm" label="Общие сведения о корзине" />
        <Box className={classes.fullCartBox}>
          <Flex justify="flex-start" align="baseline" gap={5}>
            <Text mt="xs" mb="md">
              Общая стоимость:
            </Text>
            <NumberFormatter
              value={data[0].totalPrice.centAmount / 100 || 0}
              thousandSeparator
              suffix="₽"
            />
          </Flex>
          <Flex>
            <Button onClick={() => void handleMutation()} color="red">
              Очистить корзину
            </Button>
          </Flex>
          <Flex justify="flex-start" align="flex-end" gap={10}>
            <TextInput
              label="Промокод"
              placeholder="Введите промокод"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <Button onClick={() => void applyPromo()} color="yellow">
              Применить
            </Button>
          </Flex>
        </Box>
      </Container>
    </Skeleton>
  );
};
