import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';
import { type Category } from './useCategories';
import { ProductProjection } from '@commercetools/platform-sdk';

type Props = {
  page: number;
  category?: Category;
  priceRange?: { from: number; to: number };
};

type UseProductsResult =
  | {
      isPending: false;
      isError: false;
      total: number;
      products: ProductProjection[];
    }
  | {
      isPending: true;
      isError: false;
      total?: number;
      products?: undefined;
    }
  | {
      isPending: false;
      isError: true;
      total?: number;
      products?: undefined;
    };

export const PRODUCTS_PER_PAGE = 6;

export const useProducts = ({
  page,
  category,
  priceRange,
}: Props): UseProductsResult => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { data, isPending, isError } = useQuery({
    queryKey: ['catalog', { category, page, priceRange }],
    queryFn: () => {
      const filters = [];

      if (category) {
        filters.push(`categories.id: "${category.id}"`);
      }

      if (priceRange) {
        const { from, to } = priceRange;

        filters.push(
          `variants.price.centAmount: range(${from * 100} to ${to * 100})`
        );
      }

      return apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            limit: PRODUCTS_PER_PAGE,
            offset: PRODUCTS_PER_PAGE * (page - 1),
            'filter.query': filters,
            facet: ['variants.price.centAmount: range(0 to *)'],
          },
        })
        .execute();
    },
  });

  if (isPending) return { isPending, isError };
  if (isError) return { isPending, isError };

  const response = data.body;

  return {
    products: response.results,
    total: response.total ?? 0,
    isPending,
    isError,
  };
};
