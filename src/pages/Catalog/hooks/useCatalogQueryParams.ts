import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod/v4';

export const SortSchema = z
  .literal(['price desc', 'price asc', 'name.ru asc'])
  .nullable()
  .transform((sort) => sort ?? 'name.ru asc');

const CalagQueryParamsSchema = z.object({
  page: z
    .preprocess(
      (page) => (typeof page === 'string' ? Number(page) : undefined),
      z.int().min(1)
    )
    .optional()
    .nullable(),
  sort: SortSchema,
  search: z
    .string()
    .nullable()
    .optional()
    .transform((search) => search ?? ''),
  colors: z
    .string()
    .optional()
    .nullable()
    .transform((colors) => {
      if (!colors) return [];

      return colors.split(',');
    }),
  chargeTime: z
    .string()
    .optional()
    .nullable()
    .transform((chargeTime) => {
      if (!chargeTime) return [];

      return chargeTime.split(',');
    }),
  priceRange: z
    .string()
    .refine((priceRange) => {
      const [from, to] = priceRange.split('-');

      return from && to && Number(from) && Number(to);
    })
    .optional()
    .nullable()
    .transform((priceRange) => {
      if (!priceRange) return;

      const [from, to] = priceRange.split('-');

      if (!from || !to) {
        return;
      }

      return { from: Number(from), to: Number(to) };
    }),
});

type CatalogQueryParams = Partial<z.infer<typeof CalagQueryParamsSchema>>;

export const useCatalogQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const didValidateSearchParamsRef = useRef(false);

  const parsedSearchParams = CalagQueryParamsSchema.safeParse({
    page: searchParams.get('page'),
    priceRange: searchParams.get('priceRange'),
    sort: searchParams.get('sort'),
    colors: searchParams.get('colors'),
    chargeTime: searchParams.get('chargeTime'),
    search: searchParams.get('search'),
  });

  const page = parsedSearchParams.data?.page ?? 1;

  const setCatalogQueryParams = useCallback(
    (catalogQueryParms: CatalogQueryParams) => {
      setSearchParams((currentParams) => {
        if (catalogQueryParms.page) {
          currentParams.set('page', String(catalogQueryParms.page));
        } else {
          currentParams.delete('page');
        }

        if (catalogQueryParms.priceRange) {
          const { from, to } = catalogQueryParms.priceRange;

          currentParams.set('priceRange', `${from}-${to}`);
        }

        if (catalogQueryParms.sort) {
          currentParams.set('sort', catalogQueryParms.sort);
        }

        if (catalogQueryParms.colors) {
          currentParams.set('colors', catalogQueryParms.colors.join(','));
        }

        if (catalogQueryParms.chargeTime) {
          currentParams.set(
            'chargeTime',
            catalogQueryParms.chargeTime.join(',')
          );
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

  const deleteCatalogQueryParams = useCallback(
    (catalogQueryParams: Array<keyof CatalogQueryParams>) => {
      setSearchParams((currentParams) => {
        for (const queryParam of catalogQueryParams) {
          currentParams.delete(queryParam);
        }

        return currentParams;
      });
    },
    [setSearchParams]
  );

  const resetAllFilters = () => {
    deleteCatalogQueryParams(['colors', 'priceRange', 'chargeTime', 'search']);
  };

  useEffect(() => {
    if (didValidateSearchParamsRef.current) return;

    didValidateSearchParamsRef.current = true;

    if (parsedSearchParams.success) return;

    const errorInputs = parsedSearchParams.error.issues.map((issue) => {
      const [errorKey] = issue.path;

      return errorKey.toString();
    });

    setSearchParams((searchParams) => {
      errorInputs.forEach((errorInput) => searchParams.delete(errorInput));

      return searchParams;
    });
  }, [parsedSearchParams, setSearchParams]);

  return {
    ...(parsedSearchParams.success
      ? parsedSearchParams.data
      : CalagQueryParamsSchema.parse({ page: '1', sort: null })),
    page,
    setCatalogQueryParams,
    deleteCatalogQueryParams,
    resetAllFilters,
  };
};
