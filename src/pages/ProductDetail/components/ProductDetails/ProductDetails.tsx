import { Title, Text, Stack, Badge, Flex } from '@mantine/core';
import classes from './ProductDetails.module.scss';
import { getProductPrice, formatPrice } from '../../utils/productPrice';
import { ProductType } from '../../utils/parseProductData';
import { AddToCart } from './components/AddToCart';

type ProductDetailsProps = {
  product: ProductType;
};

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const price = getProductPrice(product.variant);
  const formattedPrice = formatPrice(price);

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
      <div className={classes.priceSection}>
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
            {formattedPrice.original ? (
              <>
                <Text
                  span
                  c="dimmed"
                  td="line-through"
                  size="lg" /* 18px */
                  fw={500}
                >
                  {formattedPrice.original}
                </Text>

                <Text span size="1.5rem" fw={700} c="red">
                  {formattedPrice.current}
                </Text>

                <Badge color="red" variant="light" fw={600} size="xs">
                  Скидка
                </Badge>
              </>
            ) : (
              <Text span size="1.5rem" fw={700}>
                {formattedPrice.current}
              </Text>
            )}
          </Flex>
        )}
      </div>

      {/* Add to cart block */}
      <AddToCart product={product} />
    </Stack>
  );
};
