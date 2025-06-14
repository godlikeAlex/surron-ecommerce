import { ProductProjection } from '@commercetools/platform-sdk';
import {
  Card,
  Divider,
  Flex,
  Group,
  Image,
  NumberFormatter,
  SegmentedControl,
  Skeleton,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import classes from './ProductCard.module.scss';
import { Link } from 'react-router';
import { useProductVariants } from '../../hooks/useProductVariants';

export type ProductCardProps = Pick<
  ProductProjection,
  'name' | 'masterVariant' | 'description' | 'variants'
> & { productKey: ProductProjection['key'] };

export const ProductCard = ({
  name,
  masterVariant,
  description,
  productKey,
  variants,
}: ProductCardProps) => {
  const productName = name['ru'];
  const productDescription = description ? description['ru'] : undefined;
  const [image] = masterVariant.images || [];

  const [isImageLoading, setImageLoading] = useState(Boolean(image));

  const { selectedVariant, setSelectedVariant, variantPrices, typesOfSupply } =
    useProductVariants({
      variants,
      masterVariant,
    });

  const [price] = variantPrices || [];

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

      {/* <Group mt="md" onClick={(e) => e.stopPropagation()}>
        <Radio size="xs" checked label="В наличии" value="react" />
        <Radio size="xs" label="Под заказ" value="nu" />
      </Group> */}

      {typesOfSupply && (
        <SegmentedControl
          size="xs"
          mt="md"
          color="yellow"
          onClick={(e) => e.stopPropagation()}
          value={selectedVariant}
          onChange={setSelectedVariant}
          data={typesOfSupply}
        />
      )}

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} fz={'sm'}>
          {productName}
        </Text>
      </Group>

      {price && (
        <Flex align="center">
          {price?.discounted ? (
            <Text fw={700} c="red" fz="md">
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
