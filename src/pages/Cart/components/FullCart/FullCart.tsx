import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Modal,
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
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

export const FullCart = ({
  data,
  refetch,
}: {
  data: Cart[];
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Cart[], Error>>;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isPending, mutateAsync } = useUpdateCart(refetch);
  const { isPending: isPendingPromo, mutateAsync: promoAsync } =
    usePromo(refetch);
  const { deleteCart, isPending: isPendingDelete } = useCartDelete();
  const [value, setValue] = useState('');
  const isDiscounted = Boolean('discountOnTotalPrice' in data[0]);
  const handleMutation = async () => {
    try {
      const response = await refetch();
      const id = response.data?.[0].id || '';
      const version = response.data?.[0].version || 1;
      await deleteCart({ id, version });
      const newResponse = await refetch();
      while (
        newResponse.data?.length &&
        newResponse.data?.[0].lineItems.length > 0
      ) {
        await handleMutation();
      }
      notifications.show({
        title: 'Поздравляем!',
        message: 'Корзина успешно удалена',
        autoClose: 7000,
        withCloseButton: true,
        withBorder: true,
        color: 'green',
      });
    } catch (error) {
      if (error) {
        notifications.show({
          title: 'Упс!',
          message: 'Не удалось удалить корзину',
          autoClose: 7000,
          withCloseButton: true,
          withBorder: true,
          color: 'red',
        });
      }
    }
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
      if (e)
        notifications.show({
          title: 'Упс!',
          message: 'Данный промокод не найден',
          autoClose: 7000,
          withCloseButton: true,
          withBorder: true,
          color: 'red',
        });
    }
  };

  return (
    <Skeleton visible={isPending || isPendingDelete || isPendingPromo}>
      <Modal opened={opened} onClose={close} title="Подтверждение удаления">
        <Text>Вы действительно хотите очитстить корзину?</Text>
        <Flex gap={20}>
          <Button
            color="red"
            onClick={() => {
              close();
              void handleMutation();
            }}
          >
            Очистить
          </Button>
          <Button color="grey" onClick={() => close()}>
            Отмена
          </Button>
        </Flex>
      </Modal>
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
          {isDiscounted ? (
            <>
              <Text mt="xs" mb="md" fw={800}>
                Общая стоимость:
              </Text>
              <Flex
                justify="flex-start"
                align="baseline"
                gap={5}
                className={classes.withoutPromo}
              >
                <Text mt="xs" mb="md">
                  Без промо:
                </Text>
                <NumberFormatter
                  value={
                    ((data[0].discountOnTotalPrice?.discountedAmount
                      .centAmount || 0) / 100 || 0) +
                    (data[0].totalPrice.centAmount / 100 || 0)
                  }
                  thousandSeparator
                  suffix="₽"
                />
              </Flex>
              <Flex justify="flex-start" align="baseline" gap={5}>
                <Text mt="xs" mb="md" fw={600}>
                  С промо:
                </Text>
                <NumberFormatter
                  value={data[0].totalPrice.centAmount / 100 || 0}
                  thousandSeparator
                  suffix="₽"
                  className={classes.withPromo}
                />
              </Flex>
            </>
          ) : (
            <Flex justify="flex-start" align="baseline" gap={5}>
              <Text mt="xs" mb="md" fw={800}>
                Общая стоимость:
              </Text>
              <NumberFormatter
                value={data[0].totalPrice.centAmount / 100 || 0}
                thousandSeparator
                suffix="₽"
              />
            </Flex>
          )}

          <Flex>
            <Button onClick={() => open()} color="red">
              Очистить корзину
            </Button>
          </Flex>
          <Flex justify="flex-start" align="flex-end" gap={10}>
            <TextInput
              label="Промокод"
              placeholder="Введите промокод"
              value={value}
              disabled={isDiscounted}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <Button
              onClick={() => void applyPromo()}
              color="yellow"
              disabled={isDiscounted}
            >
              {isDiscounted ? 'Применён' : 'Применить'}
            </Button>
          </Flex>
        </Box>
      </Container>
    </Skeleton>
  );
};
