import {
  Group,
  ActionIcon,
  rem,
  NumberInput,
  Button,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ProductType } from '@/pages/ProductDetail/utils/parseProductData';
import { useCart } from '@/pages/ProductDetail/hooks/useCart';
import { ProductVariant } from '@commercetools/platform-sdk';
import { getVariantInCart } from '@/pages/ProductDetail/utils/getVariantInCart';
import { getVariantsWithTipPostavki } from '@/pages/ProductDetail/utils/variant';

type AddToCartProps = {
  product: ProductType;
  selectedVariant: ProductVariant | null;
};

export const AddToCart = ({ product, selectedVariant }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);

  const { cart, addLineItem, removeLineItem } = useCart();

  const variantInCart =
    cart &&
    selectedVariant &&
    getVariantInCart(cart, product.id, selectedVariant.id);

  const isVariantInCart = !!variantInCart;

  const isVariantWithTipPostavki =
    getVariantsWithTipPostavki(product).length > 0;

  const disabled = !selectedVariant && isVariantWithTipPostavki;

  const displayQuantity = variantInCart ? variantInCart.quantity : quantity;

  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addLineItem(product.id, selectedVariant?.id, quantity);
    }

    notifications.show({
      title: 'Успешно!',
      message: `Товар "${product.name}" добавлен в корзину (${quantity} шт.)`,
      color: 'green',
      icon: <IconCheck size="1.1rem" />,
      withCloseButton: true,
      autoClose: 3000,
    });
  };

  const handleRemoveFromCart = async () => {
    if (variantInCart) {
      const itemId = variantInCart.id;

      if (itemId) {
        await removeLineItem(itemId);
      }
    }

    notifications.show({
      title: 'Успешно!',
      message: `Товар "${product.name}" удален из корзины.)`,
      color: 'green',
      icon: <IconCheck size="1.1rem" />,
      withCloseButton: true,
      autoClose: 3000,
    });
  };

  return (
    <Group align="flex-end">
      <div>
        <Text size="sm" c="dimmed" mb={4}>
          Количество
        </Text>
        <Group gap={0}>
          <ActionIcon
            size={42}
            variant="default"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isVariantInCart}
          >
            <IconMinus />
          </ActionIcon>

          <NumberInput
            value={displayQuantity}
            onChange={(value) => setQuantity(Number(value) || 1)}
            min={1}
            max={100}
            step={1}
            hideControls
            styles={{
              input: {
                width: rem(60),
                height: rem(42),
                textAlign: 'center',
                borderRadius: 0,
                borderLeft: 'none',
                borderRight: 'none',
              },
            }}
            disabled={isVariantInCart}
          />

          <ActionIcon
            size={42}
            variant="default"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10 || isVariantInCart}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
      </div>

      {!isVariantInCart ? (
        <Tooltip
          label="Необходимо выбрать тип поставки"
          color="gray"
          disabled={!disabled}
        >
          <Button
            size="md"
            variant="gradient"
            gradient={{ from: 'cyan', to: 'yellow', deg: 114 }}
            leftSection={<IconShoppingCart size={20} />}
            onClick={() => {
              void handleAddToCart();
            }}
            disabled={disabled}
            styles={{
              root: {
                '&:disabled': {
                  background:
                    'linear-gradient(114deg, var(--mantine-color-cyan-6), var(--mantine-color-yellow-6))',
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              },
            }}
          >
            В корзину
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="md"
          variant="gradient"
          gradient={{ from: 'red', to: 'gray', deg: 114 }}
          leftSection={<IconShoppingCart size={20} />}
          onClick={() => {
            void handleRemoveFromCart();
          }}
        >
          Удалить из корзины
        </Button>
      )}
    </Group>
  );
};
