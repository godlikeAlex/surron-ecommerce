import { useApiRootStore } from '@/store/apiRootStore';
//import { MyCartUpdateAction } from '@commercetools/platform-sdk';
import { useQuery } from '@tanstack/react-query';

export const useGetCart = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { data, isPending } = useQuery({
    queryKey: ['get-cart'],
    queryFn: async () => {
      const response = await apiRoot.me().carts().get().execute();
      return response.body.results;
    },
  });

  return { data, isPending };
};
