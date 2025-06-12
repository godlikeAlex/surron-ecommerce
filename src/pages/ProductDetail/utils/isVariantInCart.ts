import { Cart, ProductVariant } from '@commercetools/platform-sdk';
import { ProductType } from './parseProductData';

export const isVariantInCart = (
  cart: Cart,
  product: ProductType,
  variant: ProductVariant
) => {
  return cart.lineItems.some(
    (item) => item.productId === product.id && item.variant.id === variant.id
  );
};
