import { Box, Skeleton } from '@mantine/core';
import sidebarClasses from './SidebarFilters.module.scss';

export const SidebarCategoriesSkeleton = () =>
  new Array(8).fill('').map((_, index) => (
    <Box
      key={index}
      className={sidebarClasses.sidebarItemWrapper}
      style={{ width: '100%' }}
    >
      <Skeleton h={25} width="100%" />
    </Box>
  ));
