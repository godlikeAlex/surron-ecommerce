import { useMemo, useState } from 'react';
import { Container, Grid, Pagination, SimpleGrid } from '@mantine/core';
import {
  BreadcrumbsCategories,
  BreadcrumbsCategoriesSkeleton,
  ProductCard,
  ProductsSkeleton,
  SidebarFilters,
} from '@/pages/Catalog/components';
import { useCategories } from '@/pages/Catalog/hooks/useCategories';
import classes from './Catalog.module.scss';
import { useParams } from 'react-router';
import {
  PRODUCTS_PER_PAGE,
  useProducts,
} from '@/pages/Catalog/hooks/useProducts';

export const Catalog = () => {
  const params = useParams();
  const [page, setPage] = useState(1);
  const selectedCategories = useMemo(() => {
    const categoriesPath = params['*'];

    if (!categoriesPath) return [];

    return categoriesPath.split('/').filter((category) => category !== '');
  }, [params]);

  const {
    categories,
    activeCategories,
    targetCategory,
    isPending: categoriesIsPending,
  } = useCategories(selectedCategories);

  const { products, isPending, isError, total } = useProducts({ page });

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
            targetCategory={targetCategory}
            categoriesLoading={categoriesIsPending}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          {isPending ? (
            <ProductsSkeleton />
          ) : isError ? (
            <h1>Error!</h1>
          ) : (
            <>
              <SimpleGrid cols={3}>
                {products.map(({ ...product }) => (
                  <ProductCard {...product} key={product.id} />
                ))}
              </SimpleGrid>

              <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil((total || 1) / PRODUCTS_PER_PAGE)}
                mt={'lg'}
              />
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};
