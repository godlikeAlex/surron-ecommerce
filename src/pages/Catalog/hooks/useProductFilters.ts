import { useApiRootStore } from '@/store/apiRootStore';
import { isRangeFacetResult } from '@/utils/guards/isRangeFacetResult';
import { FacetRange } from '@commercetools/platform-sdk';
import { useQuery } from '@tanstack/react-query';
import { type Category } from './useCategories';
import { isTermFacetResult } from '@/utils/guards/isTermFacetResult';

export type ProductFilters = {
  price?: FacetRange;
  colors?: string[];
};

type Props = {
  category?: Category;
};

type UseFilterResult =
  | {
      isPending: false;
      isError: false;
      filters: ProductFilters;
    }
  | {
      isPending: true;
      isError: false;
      filters?: undefined;
    }
  | {
      isPending: false;
      isError: true;
      filters?: undefined;
    };

export const useProductFilters = ({ category }: Props): UseFilterResult => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const { data, isPending, isError } = useQuery({
    queryKey: ['catalog-filters', { category }],
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
            limit: 0,
            'filter.query': filters,
            facet: [
              'variants.price.centAmount: range(0 to *) as priceRange',
              'variants.attributes.color.key as colors',
            ],
          },
        })
        .execute();
    },
  });

  if (isPending) return { isPending, isError };
  if (isError) return { isPending, isError };

  const response = data.body;

  const priceFacet = response.facets?.['priceRange'];
  const colorsFacet = response.facets?.['colors'];

  const facetFilters: ProductFilters = {
    price: isRangeFacetResult(priceFacet)
      ? {
          ...priceFacet.ranges[0],
          min: priceFacet.ranges[0].min / 100,
          max: priceFacet.ranges[0].max / 100,
        }
      : undefined,
    colors:
      isTermFacetResult(colorsFacet) && colorsFacet.terms.length > 0
        ? colorsFacet.terms.map(({ term }) => String(term))
        : undefined,
  };

  return {
    filters: facetFilters,
    isPending,
    isError,
  };
};
