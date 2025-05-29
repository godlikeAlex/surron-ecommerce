import {
  Group,
  ActionIcon,
  rem,
  NumberInput,
  Button,
  Text,
} from '@mantine/core';
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useState } from 'react';
import classes from '../ProductDetails.module.scss';
import { notifications } from '@mantine/notifications';
import { ProductType } from '@/pages/ProductDetail/utils/parseProductData';

type AddToCartProps = {
  product: ProductType;
};

export const AddToCart = ({ product }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (qty: number) => {
    //addToCart(product.id, qty);

    console.log(`Добавлено ${qty} товара(ов)`);

    notifications.show({
      title: 'Успешно!',
      message: `Товар "${product.name}" добавлен в корзину (${qty} шт.)`,
      color: 'teal',
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
            disabled={quantity <= 1}
          >
            <IconMinus />
          </ActionIcon>

          <NumberInput
            value={quantity}
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
          />

          <ActionIcon
            size={42}
            variant="default"
            onClick={() => setQuantity((q) => Math.min(100, q + 1))}
            disabled={quantity >= 100}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
      </div>

      <Button
        size="md"
        variant="gradient"
        gradient={{ from: 'cyan', to: 'yellow', deg: 114 }}
        className={classes.addToCartButton}
        leftSection={<IconShoppingCart size={20} />}
        onClick={() => handleAddToCart(quantity)}
      >
        В корзину
      </Button>
    </Group>
  );
};
