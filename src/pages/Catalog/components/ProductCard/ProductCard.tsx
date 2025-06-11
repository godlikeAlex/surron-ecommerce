import { ProductProjection } from '@commercetools/platform-sdk';
import {
  Card,
  Divider,
  Flex,
  Group,
  Image,
  NumberFormatter,
  Skeleton,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import classes from './ProductCard.module.scss';
import { Link } from 'react-router';

export type ProductCardProps = Pick<
  ProductProjection,
  'name' | 'masterVariant' | 'description'
> & { productKey: ProductProjection['key'] };

export const ProductCard = ({
  name,
  masterVariant,
  description,
  productKey,
}: ProductCardProps) => {
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
      role="article"
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

      {price && (
        <Flex align="center">
          {price?.discounted ? (
            <Text fw={700} c="red" fz="md">
              От{' '}
              <NumberFormatter
                value={price.discounted.value.centAmount / 100 || 0}
                thousandSeparator
                suffix=" ₽"
                style={{ paddingRight: 5 }}
              />
            </Text>
          ) : null}

          <Text
            data-testid="base-price"
            fw={700}
            td={price?.discounted && 'line-through'}
            c={price?.discounted && 'dimmed'}
            fz={price?.discounted ? 'xs' : 'md'}
          >
            От{' '}
            <NumberFormatter
              value={price.value.centAmount / 100 || 0}
              thousandSeparator
              suffix=" ₽"
            />
          </Text>
        </Flex>
      )}

      <Divider my={'md'} />

      <Text c="dimmed" size="xs">
        {productDescription}
      </Text>
    </Card>
  );
};
