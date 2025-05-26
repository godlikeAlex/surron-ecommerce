import { SimpleGrid, Skeleton } from '@mantine/core';

export const ProductsSkeleton = () => {
  return (
    <SimpleGrid cols={3}>
      {new Array(6).fill('').map((_, index) => (
        <Skeleton key={index} h={300} radius="md" width="100%" />
      ))}
    </SimpleGrid>
  );
};
