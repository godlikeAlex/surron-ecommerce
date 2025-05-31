import { ReactNode } from 'react';
import { Box, Title } from '@mantine/core';
import classes from './SidebarFilters.module.scss';

type Props = {
  title: string;
  children: ReactNode;
  withPadding?: boolean;
};

export const SidebarSection = ({
  title,
  withPadding = true,
  children,
}: Props) => (
  <Box className={classes.sidebarSection}>
    <Title order={5} className={classes.sidebarItemWrapper}>
      {title}
    </Title>

    <Box className={withPadding ? classes.sidebarItemWrapper : undefined}>
      {children}
    </Box>
  </Box>
);
