import { useState } from 'react';
import { Box, Collapse, Flex, Text, ThemeIcon } from '@mantine/core';
import { Category } from '@/pages/Catalog/hooks/useCategories';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './TreeCategoryLink.module.scss';
import sidebarClasses from '@/pages/Catalog/components/SidebarFilters/SidebarFilters.module.scss';

type Props = {
  category: Category;
  depth?: number;
};

export const TreeCategoryLink = ({ category, depth = 0 }: Props) => {
  const [opened, setOpened] = useState(false);
  const hasChildren = category.children.length > 0;

  return (
    <Box component="a" className={classes.treeCategoryLink}>
      <Flex
        align={'center'}
        justify={'space-between'}
        className={`${classes.treeCategoryLinkItem} ${sidebarClasses.sidebarItemWrapper}`}
      >
        <Text style={{ paddingLeft: `${depth * 8}px` }}>{category.name}</Text>
        {hasChildren ? (
          <ThemeIcon size={'xs'} variant="light">
            <IconChevronRight
              stroke={1.5}
              style={{ transform: opened ? 'rotate(90deg)' : 'none' }}
              onClick={() => setOpened((opened) => !opened)}
            />
          </ThemeIcon>
        ) : null}
      </Flex>
      {hasChildren
        ? category.children.map((childrenCategory) => (
            <Collapse in={opened} key={childrenCategory.id}>
              <TreeCategoryLink category={childrenCategory} depth={depth + 1} />
            </Collapse>
          ))
        : null}
    </Box>
  );
};
