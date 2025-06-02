import { Box, Button, Card, Group } from '@mantine/core';
import { TreeCategoryLink } from '../TreeCategoryLink';
import { type Category } from '@/pages/Catalog/hooks/useCategories';
import classes from './SidebarFilters.module.scss';
import { SidebarCategoriesSkeleton } from './SidebarCategoriesSkeleton';
import { PriceRangeSelect } from '../PriceRangeSelect';
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
  const {
    setCatalogQueryParams,
    deleteCatalogQueryParams,
    resetAllFilters,
    priceRange,
    colors,
  } = useCatalogQueryParams();

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
          <SidebarSection
            title="Цена"
            rightSection={
              <Button
                size="compact-xs"
                variant="light"
                disabled={priceRange === undefined}
                onClick={() => deleteCatalogQueryParams(['rangePrice'])}
              >
                Сбросить
              </Button>
            }
          >
            <PriceRangeSelect
              onChange={({ from, to }) =>
                setCatalogQueryParams({ rangePrice: [from, to] })
              }
              initialValues={
                priceRange ?? { from: filters.price.min, to: filters.price.max }
              }
              min={filters.price.min}
              max={filters.price.max}
            />
          </SidebarSection>
        )}

        {filters?.colors && (
          <SidebarSection
            title="Цвет"
            rightSection={
              <Button
                size="compact-xs"
                variant="light"
                disabled={colors.length === 0}
                onClick={() => deleteCatalogQueryParams(['colors'])}
              >
                Сбросить
              </Button>
            }
          >
            <ColorPicker
              colors={filters.colors}
              selectedColors={colors}
              onChange={(colors) => setCatalogQueryParams({ colors })}
            />
          </SidebarSection>
        )}

        {filters && (
          <SidebarSection>
            <Button
              fullWidth
              onClick={() => resetAllFilters()}
              disabled={colors.length === 0 && !priceRange}
            >
              Сбросить фильтры
            </Button>
          </SidebarSection>
        )}
      </Box>
    </Card>
  );
};
