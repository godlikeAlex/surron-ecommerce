import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { Category } from '@/pages/Catalog/hooks/useCategories';
import { Link } from 'react-router';
import { useMemo } from 'react';

type Props = {
  currentCategories: Category[];
};

const DEFAULT_BREADCRUMBS = [
  {
    name: 'Главная',
    slug: '/',
  },
  {
    name: 'Каталог',
    slug: '/catalog',
  },
];

export const BreadcrumbsCategories = ({ currentCategories }: Props) => {
  const breadcrumbs = useMemo(() => {
    const breadCrumbsWithSlugs = currentCategories.map((category, index) => {
      const slugsBeforeCurrent = currentCategories.slice(0, index + 1);

      const chainUrl = slugsBeforeCurrent
        .map((category) => category.slug)
        .join('/');

      return {
        name: category.name,
        slug: `/catalog/${chainUrl}`,
      };
    });

    return [...DEFAULT_BREADCRUMBS, ...breadCrumbsWithSlugs];
  }, [currentCategories]);

  return (
    <Breadcrumbs>
      {breadcrumbs.map((breadcrumb, index) =>
        index === breadcrumbs.length - 1 ? (
          <Text key={breadcrumb.slug}>{breadcrumb.name}</Text>
        ) : (
          <Anchor key={breadcrumb.slug} component={Link} to={breadcrumb.slug}>
            {breadcrumb.name}
          </Anchor>
        )
      )}
    </Breadcrumbs>
  );
};
