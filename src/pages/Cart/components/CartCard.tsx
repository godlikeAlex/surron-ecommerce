import {
  Avatar,
  NumberFormatter,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useGetCart } from '../hooks/useGetCart';
import classes from './CartCard.module.scss';
import { Cart } from '@commercetools/platform-sdk';
import { useState } from 'react';
import cx from 'clsx';
import { useMediaQuery } from '@mantine/hooks';

export const CartCard = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isPending, data } = useGetCart();

  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);

  const f = (d: Cart[]) => {
    const cart = d[0].lineItems;
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
            suffix=" ₽"
          />
        </Table.Td>
        <Table.Td>
          <Text truncate className={classes.quantity}>
            {row.quantity}
          </Text>
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={row.totalPrice.centAmount / 100 || 0}
            thousandSeparator
            suffix=" ₽"
          />
        </Table.Td>
      </Table.Tr>
    ));
    return (
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>{isLargeScreen ? 'Изображение' : '🛍️'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Наименование' : '🏷️'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Цена' : '💰'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Количество' : '📜'}</Table.Th>
              <Table.Th>{isLargeScreen ? 'Стоимость' : '💲'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };
  return (
    <Skeleton visible={isPending} className={classes.cartContainer}>
      {!data || data.length === 0 || data[0].lineItems.length == 0 ? (
        <Text ta="center" size="lg" lh={3}>
          Корзина пуста
        </Text>
      ) : (
        f(data)
      )}
    </Skeleton>
  );
};
