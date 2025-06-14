import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';

export const useGetCart = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);
  const token = useApiRootStore((state) => state.refreshToken);

  const { data, isPending, refetch } = useQuery({
    queryKey: ['use-get-cart', token],
    queryFn: async () => {
      const response = await apiRoot.me().carts().get().execute();
      return response.body.results;
    },
  });

  return { data, isPending, refetch };
};
