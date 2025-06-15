import { ProductProjection } from '@commercetools/platform-sdk';
import {
  Button,
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
import { MouseEvent, useState } from 'react';
import classes from './ProductCard.module.scss';
import { Link } from 'react-router';
import { useProductVariants } from '../../hooks/useProductVariants';
import { IconCheck, IconShoppingBag, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useCart } from '@/hooks/cart/useCart';

export type ProductCardProps = Pick<
  ProductProjection,
  'name' | 'masterVariant' | 'description' | 'variants' | 'id'
> & { productKey: ProductProjection['key'] };

export const ProductCard = ({
  id,
  name,
  masterVariant,
  description,
  productKey,
  variants,
}: ProductCardProps) => {
  const productName = name['ru'];
  const productDescription = description ? description['ru'] : undefined;
  const [image] = masterVariant.images || [];
  const cart = useCart();

  const [isImageLoading, setImageLoading] = useState(Boolean(image));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    selectedVariant,
    selectedVariantID,
    setSelectedVariant,
    variantPrices,
    typesOfSupply,
  } = useProductVariants({
    variants,
    masterVariant,
  });
  const [price] = variantPrices || [];

  const variantInCart = cart.has(id, selectedVariantID);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!selectedVariantID) return;

    setIsAddingToCart(true);

    cart
      .addLineItem({ productId: id, variantId: selectedVariantID, quantity: 1 })
      .then(() => {
        notifications.show({
          title: 'Успешно!',
          message: `Товар "${productName}" добавлен в корзину`,
          color: 'green',
          icon: <IconCheck />,
          withCloseButton: true,
          autoClose: 3000,
        });
      })
      .catch(() => {
        notifications.show({
          title: 'Ой!',
          message: `Не получилось добавить товар "${productName}" в корзину`,
          color: 'red',
          icon: <IconX />,
          withCloseButton: true,
          autoClose: 3000,
        });
      })
      .finally(() => setIsAddingToCart(false));
  };

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

      <Group justify="space-between" mt="md">
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

      <Button
        size="xs"
        color="yellow"
        rightSection={<IconShoppingBag />}
        mt="xs"
        variant="light"
        onClick={handleAddToCart}
        loading={isAddingToCart}
        disabled={Boolean(variantInCart)}
      >
        Добавить в корзину
      </Button>

      <Divider my={'md'} />

      <Text c="dimmed" size="xs">
        {productDescription}
      </Text>
    </Card>
  );
};
