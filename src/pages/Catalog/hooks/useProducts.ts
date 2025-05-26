import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';

type Props = {
  page: number;
};

export const PRODUCTS_PER_PAGE = 6;

export const useProducts = ({ page }: Props) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { data, isPending, isError } = useQuery({
    queryKey: ['catalog', page],
    queryFn: () => {
      return apiRoot
        .productProjections()
        .get({
          queryArgs: {
            limit: PRODUCTS_PER_PAGE,
            offset: PRODUCTS_PER_PAGE * (page - 1),
          },
        })
        .execute();
    },
  });

  return {
    products: data?.body.results ?? [],
    total: data?.body.total,
    isPending,
    isError,
  };
};
