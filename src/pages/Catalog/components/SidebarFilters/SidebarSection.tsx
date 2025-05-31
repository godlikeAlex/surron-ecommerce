import { ReactNode } from 'react';
import { Box, Skeleton, Title } from '@mantine/core';
import classes from './SidebarFilters.module.scss';

type Props = {
  title?: string;
  children: ReactNode;
  withPadding?: boolean;
};

const SidebarSection = ({ title, withPadding = true, children }: Props) => (
  <Box className={classes.sidebarSection}>
    {title && (
      <Title order={5} className={classes.sidebarItemWrapper}>
        {title}
      </Title>
    )}

    <Box className={withPadding ? classes.sidebarItemWrapper : undefined}>
      {children}
    </Box>
  </Box>
);

const SidebarSectionSkeleton = ({ children }: { children: ReactNode }) => (
  <SidebarSection title="">
    <Skeleton w={145} h={25} mb={10} />

    {children}
  </SidebarSection>
);

SidebarSection.Skeleton = SidebarSectionSkeleton;

export { SidebarSection };
