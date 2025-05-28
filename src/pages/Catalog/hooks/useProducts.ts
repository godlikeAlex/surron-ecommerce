import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';
import { type Category } from './useCategories';
import { FacetRange, ProductProjection } from '@commercetools/platform-sdk';
import { isRangeFacetResult } from '@/utils/guards/isRangeFacetResult';

type Props = {
  page: number;
  category?: Category;
};

type UseProductsResult =
  | {
      isPending: false;
      isError: false;
      total: number;
      products: ProductProjection[];
      filters: ProductFilters;
    }
  | {
      isPending: true;
      isError: false;
      total?: number;
      products?: undefined;
      filters?: undefined;
    }
  | {
      isPending: false;
      isError: true;
      total?: number;
      products?: undefined;
      filters?: undefined;
    };

export type ProductFilters = {
  price?: FacetRange;
};

export const PRODUCTS_PER_PAGE = 6;

export const useProducts = ({ page, category }: Props): UseProductsResult => {
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

  const priceFacet = response.facets?.['variants.price.centAmount'];

  const facetFilters: ProductFilters = {
    price: isRangeFacetResult(priceFacet)
      ? {
          ...priceFacet.ranges[0],
          min: priceFacet.ranges[0].min / 100,
          max: priceFacet.ranges[0].max / 100,
        }
      : undefined,
  };

  console.log(response);
  return {
    products: response.results,
    filters: facetFilters,
    total: response.total ?? 0,
    isPending,
    isError,
  };
};
