import { useMemo, useState } from 'react';
import { useApiRootStore } from '@/store/apiRootStore';
import { Container, Grid, Loader, Pagination, SimpleGrid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  BreadcrumbsCategories,
  BreadcrumbsCategoriesSkeleton,
  ProductCard,
  SidebarFilters,
} from '@/pages/Catalog/components';
import { useCategories } from '@/pages/Catalog/hooks/useCategories';
import classes from './Catalog.module.scss';
import { useParams } from 'react-router';

const PRODUCTS_PER_PAGE = 6;

export const Catalog = () => {
  const params = useParams();
  const [page, setPage] = useState(1);
  const selectedCategories = useMemo(() => {
    const categoriesPath = params['*'];

    if (!categoriesPath) return [];

    return categoriesPath.split('/').filter((category) => category !== '');
  }, [params]);
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

  const {
    categories,
    activeCategories,
    isPending: categoriesIsPending,
  } = useCategories(selectedCategories);

  return (
    <Container className={classes.catalogContainer} size="xl">
      <Grid>
        <Grid.Col span={12} mb={25}>
          {categoriesIsPending ? (
            <BreadcrumbsCategoriesSkeleton />
          ) : (
            <BreadcrumbsCategories currentCategories={activeCategories} />
          )}
        </Grid.Col>
        <Grid.Col span={3}>
          <SidebarFilters
            categories={categories}
            categoriesLoading={categoriesIsPending}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          {isPending ? (
            <Loader />
          ) : isError ? (
            <h1>Error!</h1>
          ) : (
            <>
              <SimpleGrid cols={3}>
                {data.body.results.map(({ ...product }) => (
                  <ProductCard {...product} key={product.id} />
                ))}
              </SimpleGrid>

              <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil((data?.body.total || 1) / PRODUCTS_PER_PAGE)}
                mt={'lg'}
              />
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};
