import { useMemo } from 'react';
import {
  Container,
  Divider,
  Flex,
  Grid,
  Pagination,
  SimpleGrid,
  Skeleton,
  Title,
} from '@mantine/core';
import {
  BreadcrumbsCategories,
  BreadcrumbsCategoriesSkeleton,
  ProductCard,
  ProductsSkeleton,
  SidebarFilters,
  SortOptions,
} from '@/pages/Catalog/components';
import { useCategories } from '@/pages/Catalog/hooks/useCategories';
import classes from './Catalog.module.scss';
import { useParams } from 'react-router';
import {
  PRODUCTS_PER_PAGE,
  useProducts,
} from '@/pages/Catalog/hooks/useProducts';
import { useCatalogQueryParams } from './hooks/useCatalogQueryParams';
import { useProductFilters } from './hooks/useProductFilters';

export const Catalog = () => {
  const params = useParams();
  const { page, priceRange, sort, setCatalogQueryParams } =
    useCatalogQueryParams();

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

  const filters = useProductFilters({ category: targetCategory });

  const { products, isPending, isError, total } = useProducts({
    page,
    category: targetCategory,
    priceRange,
    sort,
  });

  const isProductsLoading = isPending || filters.isPending;
  const isProductsError = isError || filters.isError;

  return (
    <Container className={classes.catalogContainer} size="xl">
      <Grid>
        <Grid.Col span={12} mb="lg">
          {categoriesIsPending ? (
            <BreadcrumbsCategoriesSkeleton />
          ) : (
            <BreadcrumbsCategories currentCategories={activeCategories} />
          )}

          <Skeleton width={320} h={35} mt="md" visible={categoriesIsPending}>
            <Title order={2}>{targetCategory?.name || 'Каталог'}</Title>
          </Skeleton>
        </Grid.Col>

        <Grid.Col span={3}>
          <SidebarFilters
            filters={!filters.isPending ? filters.filters : undefined}
            categories={categories}
            targetCategory={targetCategory}
            categoriesLoading={categoriesIsPending}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          {isProductsLoading ? (
            <ProductsSkeleton />
          ) : isProductsError ? (
            <h1>Error!</h1>
          ) : (
            <>
              <Flex justify="space-between" align="end">
                <Title order={5}>
                  Показано {Math.min(page * PRODUCTS_PER_PAGE, total)} из{' '}
                  {total}
                </Title>

                <SortOptions />
              </Flex>

              <Divider my="md" />

              <SimpleGrid cols={3}>
                {products.map(({ ...product }) => (
                  <ProductCard
                    {...product}
                    productKey={product.key}
                    key={product.id}
                  />
                ))}
              </SimpleGrid>
              <Flex justify="center">
                <Pagination
                  value={page}
                  onChange={(newPage) =>
                    setCatalogQueryParams({ page: newPage })
                  }
                  total={Math.ceil((total || 1) / PRODUCTS_PER_PAGE)}
                  mt={'lg'}
                />
              </Flex>
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};
