import { Card, Divider, Group, Title } from '@mantine/core';
import { TreeCategoryLink } from '../TreeCategoryLink';
import { Category } from '@/pages/Catalog/hooks/useCategories';
import classes from './SidebarFilters.module.scss';
import { SidebarCategoriesSkeleton } from './SidebarCategoriesSkeleton';

type Props = {
  categories: Category[];
  categoriesLoading: boolean;
};

export const SidebarFilters = ({ categories, categoriesLoading }: Props) => {
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
            <TreeCategoryLink key={category.id} category={category} />
          ))
        )}
      </Group>
      <Divider my={'md'} />
    </Card>
  );
};
