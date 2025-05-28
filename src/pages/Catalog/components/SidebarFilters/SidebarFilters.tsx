import { Box, Button, Card, Divider, Group, Title } from '@mantine/core';
import { TreeCategoryLink } from '../TreeCategoryLink';
import { type Category } from '@/pages/Catalog/hooks/useCategories';
import classes from './SidebarFilters.module.scss';
import { SidebarCategoriesSkeleton } from './SidebarCategoriesSkeleton';
import { PriceRangeSelect } from '../PriceRangeSelect';
import { type ProductFilters } from '../../hooks/useProducts';

type Props = {
  categories: Category[];
  targetCategory?: Category;
  categoriesLoading: boolean;
  filters?: ProductFilters;
};

export const SidebarFilters = ({
  categories,
  categoriesLoading,
  targetCategory,
  filters,
}: Props) => {
  return (
    <Card component="aside" padding={0} shadow="lg" withBorder>
      <Title order={4} className={classes.sidebarItemWrapper}>
        Категории
      </Title>
      <Group gap={0}>
        {categoriesLoading ? (
          <SidebarCategoriesSkeleton />
        ) : (
          categories.map((category) => (
            <TreeCategoryLink
              key={category.id}
              category={category}
              targetCategory={targetCategory}
            />
          ))
        )}
      </Group>
      <Divider />

      {filters?.price && (
        <>
          <Title order={4} className={classes.sidebarItemWrapper}>
            Цена
          </Title>

          <Box className={classes.sidebarItemWrapper}>
            <PriceRangeSelect
              min={filters.price.min}
              max={filters.price.max}
              onChange={(c) => console.log(c)}
            />
          </Box>

          <Divider />

          <Box className={classes.sidebarItemWrapper}>
            <Button fullWidth>Применить</Button>
          </Box>
        </>
      )}
    </Card>
  );
};
