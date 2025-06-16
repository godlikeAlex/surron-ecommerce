import { Cart } from '@commercetools/platform-sdk';

export const getVariantInCart = (
  cart: Cart,
  productID: string,
  variantID: number
) => {
  const matchingItem = cart.lineItems.find(
    (item) => item.productId === productID && item.variant.id === variantID
  );
  return matchingItem;
};
