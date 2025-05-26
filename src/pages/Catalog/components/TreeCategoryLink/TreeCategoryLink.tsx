import { MouseEvent, useState } from 'react';
import { Box, Collapse, Flex, Text, ThemeIcon } from '@mantine/core';
import { Category } from '@/pages/Catalog/hooks/useCategories';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './TreeCategoryLink.module.scss';
import sidebarClasses from '@/pages/Catalog/components/SidebarFilters/SidebarFilters.module.scss';
import { Link } from 'react-router';

type Props = {
  category: Category;
  chainUrl?: string;
  depth?: number;
};

export const TreeCategoryLink = ({
  category,
  chainUrl = '',
  depth = 0,
}: Props) => {
  const [opened, setOpened] = useState(false);
  const hasChildren = category.children.length > 0;

  const handleExpandMenu = (e: MouseEvent) => {
    e.preventDefault();
    setOpened((opened) => !opened);
  };

  return (
    <Box className={classes.treeCategoryLink}>
      <Flex
        component={Link}
        to={`/catalog${chainUrl}/${category.slug}`}
        align={'center'}
        justify={'space-between'}
        className={`${classes.treeCategoryLinkItem} ${sidebarClasses.sidebarItemWrapper}`}
      >
        <Text style={{ paddingLeft: `${depth * 8}px` }}>{category.name}</Text>
        {hasChildren ? (
          <ThemeIcon size={'xs'} variant="light" onClick={handleExpandMenu}>
            <IconChevronRight
              stroke={1.5}
              style={{ transform: opened ? 'rotate(90deg)' : 'none' }}
            />
          </ThemeIcon>
        ) : null}
      </Flex>
      {hasChildren
        ? category.children.map((childrenCategory) => (
            <Collapse in={opened} key={childrenCategory.id}>
              <TreeCategoryLink
                category={childrenCategory}
                depth={depth + 1}
                chainUrl={`${chainUrl}/${category.slug}`}
              />
            </Collapse>
          ))
        : null}
    </Box>
  );
};
