import { useMemo } from 'react';
import { useApiRootStore } from '@/store/apiRootStore';
import { CategoryReference } from '@commercetools/platform-sdk';
import { useQuery } from '@tanstack/react-query';

export type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  key?: string;
  children: Category[];
  parent?: CategoryReference;
};

export const useCategories = (selectedCategories: string[]) => {
  const apiRoot = useApiRootStore((state) => state.apiRoot);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiRoot.categories().get().execute(),
  });

  const [categories = [], activeCategories = []] = useMemo(() => {
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
        isActive: selectedCategories.includes(category.slug['ru']),
        parent: category.parent,
      });
    }

    const tree: Category[] = [];
    const activeCategories: Category[] = [];

    mapCategories.forEach((category) => {
      if (category.isActive) activeCategories.push(category);

      if (!category.parent) return tree.push(category);

      const parentCategory = mapCategories.get(category.parent.id);

      if (!parentCategory) return;

      parentCategory.children.push(category);
    });

    return [tree, activeCategories];
  }, [categoriesQuery.data, selectedCategories]);

  console.log(activeCategories);

  return {
    categories,
    activeCategories,
    targetCategory: activeCategories.at(-1),
    isPending: categoriesQuery.isPending,
    isIncorectCategoriesPath:
      selectedCategories.length !== activeCategories?.length,
  };
};
