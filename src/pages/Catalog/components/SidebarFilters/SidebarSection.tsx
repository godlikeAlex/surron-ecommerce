import { ReactNode } from 'react';
import { Box, Flex, Skeleton, Title } from '@mantine/core';
import classes from './SidebarFilters.module.scss';

type Props = {
  title?: string;
  children: ReactNode;
  withPadding?: boolean;
  rightSection?: ReactNode;
};

const SidebarSection = ({
  title,
  withPadding = true,
  children,
  rightSection,
}: Props) => (
  <Box className={classes.sidebarSection}>
    {title && (
      <Flex
        justify="space-between"
        align="center"
        className={classes.sidebarItemWrapper}
      >
        <Title order={5}>{title}</Title>

        {rightSection}
      </Flex>
    )}

    <Box className={withPadding ? classes.sidebarItemWrapper : undefined}>
      {children}
    </Box>
  </Box>
);

const SidebarSectionSkeleton = ({ children }: { children: ReactNode }) => (
  <SidebarSection title="">
    <Skeleton w={145} h={25} mb={10} role="presentation" />

    {children}
  </SidebarSection>
);

SidebarSection.Skeleton = SidebarSectionSkeleton;

export { SidebarSection };
