import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';
import { Category } from './useCategories';

type Props = {
  page: number;
  category?: Category;
};

export const PRODUCTS_PER_PAGE = 6;

export const useProducts = ({ page, category }: Props) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { data, isPending, isError } = useQuery({
    queryKey: ['catalog', { category, page }],
    queryFn: () => {
      const filters = [];

      if (category) {
        filters.push(`categories.id: "${category.id}"`);
      }

      return apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            limit: PRODUCTS_PER_PAGE,
            offset: PRODUCTS_PER_PAGE * (page - 1),
            filter: filters,
          },
        })
        .execute();
    },
  });

  return {
    products: data?.body.results ?? [],
    total: data?.body.total ?? 0,
    isPending,
    isError,
  };
};
