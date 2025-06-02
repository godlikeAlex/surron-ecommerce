import { Breadcrumbs, Skeleton } from '@mantine/core';

export const BreadcrumbsCategoriesSkeleton = () => (
  <Breadcrumbs>
    <Skeleton height={16} width={59} />
    <Skeleton height={16} width={60} />
    <Skeleton height={16} width={120} />
  </Breadcrumbs>
);
