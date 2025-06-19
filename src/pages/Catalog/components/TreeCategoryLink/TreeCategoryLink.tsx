import { MouseEvent, useState } from 'react';
import {
  Box,
  Collapse,
  Flex,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { Category } from '@/pages/Catalog/hooks/useCategories';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './TreeCategoryLink.module.scss';
import sidebarClasses from '@/pages/Catalog/components/SidebarFilters/SidebarFilters.module.scss';
import { Link } from 'react-router';

type Props = {
  category: Category;
  targetCategory?: Category;
  chainUrl?: string;
  depth?: number;
};

export const TreeCategoryLink = ({
  category,
  targetCategory,
  chainUrl = '',
  depth = 0,
}: Props) => {
  const [opened, setOpened] = useState(category.isActive);
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
        className={`${classes.treeCategoryLinkItem} ${sidebarClasses.sidebarItemWrapper} ${targetCategory?.id === category.id ? classes.treeCategoryLinkItemActive : ''}`}
      >
        <Text style={{ paddingLeft: `${depth * 8}px` }}>{category.name}</Text>
        {hasChildren ? (
          <UnstyledButton
            onClick={handleExpandMenu}
            aria-label="Раскрыть категории"
          >
            <ThemeIcon size={'xs'} variant="light">
              <IconChevronRight
                stroke={1.5}
                style={{ transform: opened ? 'rotate(90deg)' : 'none' }}
              />
            </ThemeIcon>
          </UnstyledButton>
        ) : null}
      </Flex>
      {hasChildren
        ? category.children.map((childrenCategory) => (
            <Collapse in={opened} key={childrenCategory.id}>
              <TreeCategoryLink
                category={childrenCategory}
                targetCategory={targetCategory}
                depth={depth + 1}
                chainUrl={`${chainUrl}/${category.slug}`}
              />
            </Collapse>
          ))
        : null}
    </Box>
  );
};
