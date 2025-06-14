import { useGetCart } from './hooks/useGetCart';
import { Skeleton } from '@mantine/core';
import { EmptyCart } from './components/EmptyCart/EmptyCart';
import { FullCart } from './components/FullCart/FullCart';
export const Cart = () => {
  const { isPending, data, refetch } = useGetCart();
  return (
    <Skeleton visible={isPending}>
      {!data || data.length === 0 || data[0].lineItems.length == 0 ? (
        <EmptyCart />
      ) : (
        <FullCart data={data} refetch={refetch} />
      )}
    </Skeleton>
  );
};
