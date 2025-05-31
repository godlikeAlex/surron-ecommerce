import { useRef } from 'react';
import { Box, Card, Group } from '@mantine/core';
import { TreeCategoryLink } from '../TreeCategoryLink';
import { type Category } from '@/pages/Catalog/hooks/useCategories';
import classes from './SidebarFilters.module.scss';
import { SidebarCategoriesSkeleton } from './SidebarCategoriesSkeleton';
import {
  PriceRangeSelect,
  type PriceRangeSelectHandle,
} from '../PriceRangeSelect';
import { type ProductFilters } from '@/pages/Catalog/hooks/useProductFilters';
import { useCatalogQueryParams } from '@/pages/Catalog/hooks/useCatalogQueryParams';
import { ColorPicker } from '../ColorPicker';
import { SidebarSection } from './SidebarSection';

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
  const { setCatalogQueryParams, priceRange, colors } = useCatalogQueryParams();

  const rangePriceRef = useRef<PriceRangeSelectHandle>(null);

  return (
    <Card component="aside" padding={0} shadow="lg" withBorder>
      <Box className={classes.sidebarSectionList}>
        <SidebarSection title="Категории" withPadding={false}>
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
        </SidebarSection>

        {!filters && (
          <>
            <SidebarSection.Skeleton>
              <PriceRangeSelect.Skeleton />
            </SidebarSection.Skeleton>

            <SidebarSection.Skeleton>
              <ColorPicker.Skeleton />
            </SidebarSection.Skeleton>
          </>
        )}

        {filters?.price && (
          <SidebarSection title="Цена">
            <PriceRangeSelect
              onChange={({ from, to }) =>
                setCatalogQueryParams({ rangePrice: [from, to] })
              }
              initialValues={priceRange}
              min={filters.price.min}
              max={filters.price.max}
              ref={rangePriceRef}
            />
          </SidebarSection>
        )}

        {filters?.colors && (
          <SidebarSection title="Цвет">
            <ColorPicker
              colors={filters.colors}
              selectedColors={colors}
              onChange={(colors) => setCatalogQueryParams({ colors })}
            />
          </SidebarSection>
        )}
      </Box>
    </Card>
  );
};
