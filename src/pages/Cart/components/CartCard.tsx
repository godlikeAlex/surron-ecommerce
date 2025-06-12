import {
  ActionIcon,
  Avatar,
  Center,
  Group,
  NumberFormatter,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useGetCart } from '../hooks/useGetCart';
import classes from './CartCard.module.scss';
import { Cart, MyCartUpdateAction } from '@commercetools/platform-sdk';
import { useState } from 'react';
import cx from 'clsx';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useQuantity } from '../hooks/useQuantity';

export const CartCard = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isPending, data } = useGetCart();
  const { isPending: isPendingEdit, mutateAsync } = useQuantity();

  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);

  const tableData = (responseCart: Cart[]) => {
    const cart = responseCart[0].lineItems;
    const rows = cart.map((row) => (
      <Table.Tr key={row.id} className={classes.tableRow}>
        <Table.Td>
          <Avatar
            size={isLargeScreen ? 36 : 16}
            src={row.variant.images ? row.variant.images[0].url : null}
            radius={isLargeScreen ? 36 : 16}
          />
        </Table.Td>
        <Table.Td>
          <Text className={classes.productName}>{row.name['ru']}</Text>
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={row.price.value.centAmount / 100 || 0}
            thousandSeparator
          />
        </Table.Td>
        <Table.Td>
          <Group gap={2}>
            <ActionIcon
              size={isLargeScreen ? 21 : 16}
              variant="default"
              disabled={row.quantity <= 1}
              onClick={() => {
                const actions: MyCartUpdateAction[] = [
                  {
                    action: 'changeLineItemQuantity',
                    lineItemId: row.id,
                    quantity: row.quantity - 1,
                  },
                ];
                void mutateAsync(actions);
              }}
            >
              <IconMinus />
            </ActionIcon>
            <Text className={classes.quantity} truncate>
              {row.quantity}
            </Text>
            <ActionIcon
              size={isLargeScreen ? 21 : 16}
              variant="default"
              disabled={row.quantity >= 100}
              onClick={() => {
                const actions: MyCartUpdateAction[] = [
                  {
                    action: 'changeLineItemQuantity',
                    lineItemId: row.id,
                    quantity: row.quantity + 1,
                  },
                ];
                void mutateAsync(actions);
              }}
            >
              <IconPlus />
            </ActionIcon>
          </Group>
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={row.totalPrice.centAmount / 100 || 0}
            thousandSeparator
          />
        </Table.Td>
      </Table.Tr>
    ));
    return (
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table horizontalSpacing={isLargeScreen ? 'md' : '3px'}>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>{isLargeScreen ? 'Изображение' : '🛍️'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Наименование' : '🏷️'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Цена, ₽' : '💰, ₽'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Количество' : '📜'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Стоимость, ₽' : '💲, ₽'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };
  return (
    <Skeleton
      visible={isPending || isPendingEdit}
      className={classes.cartContainer}
    >
      {!data || data.length === 0 || data[0].lineItems.length == 0 ? (
        <>
          <Text ta="center" size="md" lh={2}>
            Корзина пуста, выберите что-нибудь из нашего
          </Text>
          <Center>
            <Link to="/catalog" className={classes.link}>
              каталога
            </Link>
          </Center>
        </>
      ) : (
        tableData(data)
      )}
    </Skeleton>
  );
};
