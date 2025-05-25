import { useMemo } from 'react';
import { useApiRootStore } from '@/store/apiRootStore';
import { CategoryReference } from '@commercetools/platform-sdk';
import { useQuery } from '@tanstack/react-query';

export type Category = {
  id: string;
  name: string;
  slug: string;
  key?: string;
  children: Category[];
  parent?: CategoryReference;
};

export const useCategories = () => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiRoot.categories().get().execute(),
  });

  const categories: Category[] = useMemo(() => {
    if (!categoriesQuery.data) return [];

    const fetchedCategories = categoriesQuery.data?.body.results || [];
    const mapCategories = new Map<string, Category>();

    for (const category of fetchedCategories) {
      mapCategories.set(category.id, {
        id: category.id,
        name: category.name['ru'],
        slug: category.slug['ru'],
        key: category.key,
        children: [],
        parent: category.parent,
      });
    }

    const tree: Category[] = [];

    mapCategories.forEach((category) => {
      if (!category.parent) return tree.push(category);

      const parentCategory = mapCategories.get(category.parent.id);

      if (!parentCategory) return;

      parentCategory.children.push(category);
    });

    return tree;
  }, [categoriesQuery.data]);

  return {
    categories,
    isPending: categoriesQuery.isPending,
  };
};
