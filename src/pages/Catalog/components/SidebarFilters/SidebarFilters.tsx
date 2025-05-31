import { useRef } from 'react';
import { Box, Button, Card, Group } from '@mantine/core';
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
import { notifications } from '@mantine/notifications';
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
  const { setCatalogQueryParams, priceRange } = useCatalogQueryParams();

  const rangePriceRef = useRef<PriceRangeSelectHandle>(null);

  const handleApplyFilters = () => {
    const rangePrice = rangePriceRef.current;

    if (rangePrice) {
      const { from, to } = rangePrice.getValue();

      if (from !== to) {
        setCatalogQueryParams({ rangePrice: [from, to] });
      }
    }

    notifications.show({
      title: '✅ Готово',
      message: 'Фильтры успешно применены.',
      position: 'bottom-center',
    });
  };

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

        {filters?.price && (
          <SidebarSection title="Цена">
            <PriceRangeSelect
              initialValues={priceRange}
              min={filters.price.min}
              max={filters.price.max}
              ref={rangePriceRef}
            />
          </SidebarSection>
        )}

        {filters?.colors && (
          <SidebarSection title="Цвет">
            <ColorPicker colors={filters.colors} />
          </SidebarSection>
        )}
      </Box>

      <Box className={classes.sidebarItemWrapper}>
        <Button fullWidth onClick={handleApplyFilters}>
          Применить фильтры
        </Button>
      </Box>
    </Card>
  );
};
