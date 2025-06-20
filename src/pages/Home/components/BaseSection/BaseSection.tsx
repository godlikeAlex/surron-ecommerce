import { Box, Container, Text, Title } from '@mantine/core';
import { ReactNode } from 'react';

import classes from './BaseSection.module.scss';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export const BaseSection = ({ title, description, children }: Props) => (
  <Box component="section" className={classes.baseSection}>
    <Container size={'xl'} className={classes.baseSectionInfo} mb={'xl'}>
      {title && <Title order={2}>{title}</Title>}
      {description && (
        <Container>
          <Text size="sm" c="dimmed" mt={'xs'}>
            {description}
          </Text>
        </Container>
      )}
    </Container>

    <Container size={'xl'}>{children}</Container>
  </Box>
);
