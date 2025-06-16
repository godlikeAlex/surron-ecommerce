import { Container, SimpleGrid, Skeleton } from '@mantine/core';
import classes from './FullCart.module.scss';
import { Cart } from '@commercetools/platform-sdk';
import { CartCard } from '../CartCard/CartCard';
import { useUpdateCart } from '../../hooks/useUpdateCart';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

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
  return (
    <Skeleton visible={isPending}>
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
      </Container>
    </Skeleton>
  );
};
