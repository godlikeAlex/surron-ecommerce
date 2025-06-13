import { Cart, ProductVariant } from '@commercetools/platform-sdk';
import { ProductType } from './parseProductData';

export const getVariantInCart = (
  cart: Cart,
  product: ProductType,
  variant: ProductVariant
) => {
  const matchingItem = cart.lineItems.find(
    (item) => item.productId === product.id && item.variant.id === variant.id
  );
  return matchingItem;
};
