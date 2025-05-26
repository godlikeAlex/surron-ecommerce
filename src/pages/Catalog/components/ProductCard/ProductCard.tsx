import { ProductProjection } from '@commercetools/platform-sdk';
import {
  Card,
  Divider,
  Group,
  Image,
  NumberFormatter,
  Skeleton,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import classes from './ProductCard.module.scss';
import { Link } from 'react-router';

type Props = Pick<
  ProductProjection,
  'name' | 'masterVariant' | 'description'
> & { productKey: ProductProjection['key'] };

export const ProductCard = ({
  name,
  masterVariant,
  description,
  productKey,
}: Props) => {
  const productName = name['ru'];
  const productDescription = description ? description['ru'] : undefined;
  const [price] = masterVariant?.prices || [];
  const [image] = masterVariant.images || [];

  const [isImageLoading, setImageLoading] = useState(Boolean(image));

  return (
    <Card
      className={classes.productCard}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      to={`/products/${productKey}`}
    >
      <Card.Section>
        <Skeleton visible={isImageLoading}>
          {image ? (
            <Image
              src={image.url}
              height={200}
              alt={productName}
              onLoad={() => setImageLoading(false)}
            />
          ) : null}
        </Skeleton>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} fz={'sm'}>
          {productName}
        </Text>
      </Group>

      <Text fw={700} fz={'md'}>
        <NumberFormatter
          value={price.value.centAmount / 100 || 0}
          thousandSeparator
          suffix=" ₽"
        />
      </Text>
      <Divider my={'md'} />

      <Text c="dimmed" size="xs">
        {productDescription}
      </Text>
    </Card>
  );
};
