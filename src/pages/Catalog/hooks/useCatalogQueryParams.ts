import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

type CatalogQueryParams = {
  page?: number;
  rangePrice?: [number, number];
};

export const useCatalogQueryParams = () => {
  const [searchParmas, setSearchParams] = useSearchParams();

  const page = searchParmas.get('page') || 1;
  const priceRange = searchParmas.get('price-range');

  const parsedPriceRange = useMemo(() => {
    if (!priceRange) return;

    const [from, to] = priceRange.split('-');

    if (!from || !to) {
      return;
    }

    return { from: Number(from), to: Number(to) };
  }, [priceRange]);

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

        return currentParams;
      });
    },
    [setSearchParams]
  );

  return {
    page: Number(page),
    priceRange: parsedPriceRange,
    setCatalogQueryParams,
  };
};
