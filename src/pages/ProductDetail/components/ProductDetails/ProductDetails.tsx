import { Title, Text, Stack, Flex, Button, Group } from '@mantine/core';
import classes from './ProductDetails.module.scss';
import { getProductPrice, formatPrice } from '../../utils/price';
import { ProductType } from '../../utils/parseProductData';
import { useEffect, useState } from 'react';
import { ProductVariant } from '@commercetools/platform-sdk';
import {
  getVariantsWithTipPostavki,
  getVariantAttrLabel,
} from '../../utils/variant';
import { AddToCart } from './AddToCart/AddToCart';

type ProductDetailsProps = {
  product: ProductType;
};

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const price = getProductPrice(selectedVariant ?? product.variant);
  const formattedPrice = formatPrice(price);
  const variantsWithTipPostavki = getVariantsWithTipPostavki(product);
  const isVariantWithTipPostavki = variantsWithTipPostavki.length > 0;

  useEffect(() => {
    if (!isVariantWithTipPostavki) {
      setSelectedVariant(product.variant);
    } else {
      setSelectedVariant(variantsWithTipPostavki[0]);
    }
  }, []);

  return (
    <Stack
      className={classes.detailsContainer}
      gap="md"
      style={{
        justifyContent: 'space-between',
      }}
    >
      <Title order={1} className={classes.productTitle}>
        {product.name}
      </Title>

      <Text className={classes.productDescription}>{product.description}</Text>

      {/* Price */}
      <div>
        <Text
          size="sm"
          c="dimmed"
          className={classes.priceLabel}
          mb="4px"
          fw={500}
        >
          Цена
        </Text>

        {formattedPrice && (
          <Flex gap="xs" wrap="wrap">
            {!selectedVariant && isVariantWithTipPostavki && (
              <Text span size="1.5rem" fw={700}>
                От{' '}
              </Text>
            )}
            {formattedPrice.original ? (
              <>
                <Text span size="1.5rem" fw={700} c="red">
                  {formattedPrice.current}
                </Text>

                <Text
                  span
                  c="dimmed"
                  td="line-through"
                  size="lg" /* 18px */
                  fw={500}
                >
                  {formattedPrice.original}
                </Text>
              </>
            ) : (
              <Text span size="1.5rem" fw={700}>
                {formattedPrice.current}
              </Text>
            )}
          </Flex>
        )}
      </div>

      {/* Variant buttons */}
      <Stack gap={0}>
        <Text size="sm" c="dimmed" mb={4}>
          Тип поставки
        </Text>
        <Group gap="sm">
          {isVariantWithTipPostavki ? (
            variantsWithTipPostavki.map((variant) => (
              <Button
                key={variant.key}
                variant={variant === selectedVariant ? 'filled' : 'outline'}
                color="yellow"
                radius="xl"
                size="md"
                onClick={() => setSelectedVariant(variant)}
              >
                {getVariantAttrLabel(variant)}
              </Button>
            ))
          ) : (
            <Text size="sm" c="dimmed" mb={4}>
              -
            </Text>
          )}
        </Group>
      </Stack>

      {/* Add to cart button block */}
      <AddToCart product={product} selectedVariant={selectedVariant} />
    </Stack>
  );
};
