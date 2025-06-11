import { useGetCart } from '../hooks/useGetCart';

export const CartCard = () => {
  const { isPending, data } = useGetCart();

  return <>{isPending ? 'Pending' : JSON.stringify(data)}</>;
};
