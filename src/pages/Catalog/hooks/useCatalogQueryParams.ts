import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

type CatalogQueryParams = {
  page: number;
};

export const useCatalogQueryParams = () => {
  const [searchParmas, setSearchParams] = useSearchParams();

  const page = searchParmas.get('page') || 1;

  const setCatalogQueryParams = useCallback(
    (catalogQueryParms: CatalogQueryParams) => {
      setSearchParams((currentParams) => {
        if (catalogQueryParms.page) {
          currentParams.set('page', String(catalogQueryParms.page));
        }

        return currentParams;
      });
    },
    []
  );

  return { page: Number(page), setCatalogQueryParams };
};
