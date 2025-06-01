import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

type CatalogQueryParams = {
  page?: number;
  sort?: string;
  rangePrice?: [number, number];
  colors?: string[];
  search?: string;
};

export const useCatalogQueryParams = () => {
  const [searchParmas, setSearchParams] = useSearchParams();

  const page = searchParmas.get('page') || 1;
  const priceRange = searchParmas.get('price-range');
  const sort = searchParmas.get('sort') || 'name.ru asc';
  const colors = searchParmas.get('colors');
  const search = searchParmas.get('search') || undefined;

  const parsedPriceRange = useMemo(() => {
    if (!priceRange) return;

    const [from, to] = priceRange.split('-');

    if (!from || !to) {
      return;
    }

    return { from: Number(from), to: Number(to) };
  }, [priceRange]);

  const parsedColors = useMemo(() => {
    if (!colors) return [];

    return colors.split(',');
  }, [colors]);

  const setCatalogQueryParams = useCallback(
    (catalogQueryParms: CatalogQueryParams) => {
      setSearchParams((currentParams) => {
        if (catalogQueryParms.page) {
          currentParams.set('page', String(catalogQueryParms.page));
        }

        if (catalogQueryParms.rangePrice) {
          const [from, to] = catalogQueryParms.rangePrice;

          currentParams.set('price-range', `${from}-${to}`);
        }

        if (catalogQueryParms.sort) {
          currentParams.set('sort', catalogQueryParms.sort);
        }

        if (catalogQueryParms.colors) {
          currentParams.set('colors', catalogQueryParms.colors.join(','));
        }

        if (typeof catalogQueryParms.search === 'string') {
          currentParams.set('search', catalogQueryParms.search);

          if (catalogQueryParms.search.length === 0) {
            currentParams.delete('search');
          }
        }

        return currentParams;
      });
    },
    [setSearchParams]
  );

  return {
    page: Number(page),
    priceRange: parsedPriceRange,
    setCatalogQueryParams,
    sort,
    search,
    colors: parsedColors,
  };
};
