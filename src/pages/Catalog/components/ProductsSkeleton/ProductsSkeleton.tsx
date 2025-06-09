import { Divider, SimpleGrid, Skeleton } from '@mantine/core';

export const ProductsSkeleton = () => {
  return (
    <>
      <Skeleton h={20} width={180} role="presentation"></Skeleton>
      <Divider my="md" />
      <SimpleGrid cols={3}>
        {new Array(6).fill('').map((_, index) => (
          <Skeleton
            key={index}
            h={300}
            radius="md"
            width="100%"
            role="presentation"
          />
        ))}
      </SimpleGrid>
    </>
  );
};
