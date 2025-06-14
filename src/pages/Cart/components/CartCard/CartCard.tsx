import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Image,
  NumberFormatter,
  Skeleton,
  Text,
} from '@mantine/core';
import classes from './CartCard.module.scss';
import { LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { useState } from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { isAttribute } from '../utils/typePredicate';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

export const CartCard = ({
  data,
  cartId,
  cartVersion,
  mutateAsync,
}: {
  data: LineItem;
  cartId: string;
  cartVersion: number;
  mutateAsync: UseMutateAsyncFunction<
    void,
    Error,
    {
      actions: MyCartUpdateAction[];
      cartId: string;
      cartVersion: number;
    },
    unknown
  >;
}) => {
  const image = data.variant.images ? data.variant.images[0] : null;
  const name = data.name['ru'];
  const attrDelivery: unknown = data.variant.attributes?.find(
    (attr) => attr.name === 'tip-postavki'
  )?.value;
  const labelDelivery = isAttribute(attrDelivery) ? attrDelivery.label : null;
  const price = data.price.discounted
    ? data.price.discounted.value.centAmount
    : data.price.value.centAmount;
  const totalPrice = data.totalPrice.centAmount;
  const quantity = data.quantity;
  const id = data.id;

  const [isImageLoading, setImageLoading] = useState(Boolean(image));

  return (
    <Box className={classes.cartCard}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className={classes.card}
      >
        <Skeleton visible={isImageLoading} w={100}>
          {image ? (
            <Image
              src={image.url}
              radius="md"
              alt={name}
              onLoad={() => setImageLoading(false)}
              className={classes.image}
            />
          ) : null}
        </Skeleton>
        <div className={classes.body}>
          <Text className={classes.title} mt="xs" mb="md">
            {name}
          </Text>
          <Text className={classes.delivery} mt="xs" mb="md">
            {labelDelivery}
          </Text>
          <Flex justify="flex-start" align="baseline" gap={5}>
            <Text className={classes.price} mt="xs" mb="md">
              Цена:
            </Text>
            <NumberFormatter
              value={price / 100 || 0}
              thousandSeparator
              suffix="₽"
            />
          </Flex>
          <Flex justify="flex-start" align="baseline" gap={5}>
            <Text className={classes.price} mt="xs" mb="md">
              Количество:
            </Text>
            <Group gap={2}>
              <ActionIcon
                size={21}
                variant="default"
                disabled={quantity <= 1}
                onClick={() => {
                  const actions: MyCartUpdateAction[] = [
                    {
                      action: 'changeLineItemQuantity',
                      lineItemId: id,
                      quantity: quantity - 1,
                    },
                  ];
                  void mutateAsync({ actions, cartId, cartVersion });
                }}
              >
                <IconMinus />
              </ActionIcon>
              <Text truncate>{quantity}</Text>
              <ActionIcon
                size={21}
                variant="default"
                disabled={quantity >= 10}
                onClick={() => {
                  const actions: MyCartUpdateAction[] = [
                    {
                      action: 'changeLineItemQuantity',
                      lineItemId: id,
                      quantity: quantity + 1,
                    },
                  ];
                  void mutateAsync({ actions, cartId, cartVersion });
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Group>
          </Flex>
          <Flex justify="flex-start" align="baseline" gap={5}>
            <Text className={classes.price} mt="xs" mb="md">
              Стоимость:
            </Text>
            <NumberFormatter
              value={totalPrice / 100 || 0}
              thousandSeparator
              suffix="₽"
            />
          </Flex>
          <Button
            color="red"
            onClick={() => {
              const actions: MyCartUpdateAction[] = [
                {
                  action: 'removeLineItem',
                  lineItemId: id,
                },
              ];
              void mutateAsync({ actions, cartId, cartVersion });
            }}
          >
            Удалить
          </Button>
        </div>
      </Card>
    </Box>
  );
};
