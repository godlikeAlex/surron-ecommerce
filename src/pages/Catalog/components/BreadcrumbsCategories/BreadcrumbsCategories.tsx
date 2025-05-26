import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { Category } from '@/pages/Catalog/hooks/useCategories';

type Props = {
  currentCategories: Category[];
};

export const BreadcrumbsCategories = ({ currentCategories }: Props) => {
  return (
    <Breadcrumbs>
      <Anchor>Главная</Anchor>
      <Anchor>Каталог</Anchor>
      {currentCategories.map((category, index) =>
        index === currentCategories.length - 1 ? (
          <Text key={category.slug}>{category.name}</Text>
        ) : (
          <Anchor key={category.slug}>{category.name}</Anchor>
        )
      )}
    </Breadcrumbs>
  );
};
