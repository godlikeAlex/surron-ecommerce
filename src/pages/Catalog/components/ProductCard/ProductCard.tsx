import { ProductProjection } from '@commercetools/platform-sdk';
import { Card, Group, Image, Text } from '@mantine/core';

type Props = Pick<ProductProjection, 'name' | 'masterVariant'>;

export const ProductCard = ({ name, masterVariant }: Props) => {
  const productName = name['ru'];
  const [image] = masterVariant.images || [];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {image ? (
          <Image src={image.url} height={200} radius="md" alt={productName} />
        ) : null}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} fz={'sm'}>
          {productName}
        </Text>
      </Group>

      <Text fw={700} fz={'xl'}>
        35,000 ₽
      </Text>
    </Card>
  );
};
