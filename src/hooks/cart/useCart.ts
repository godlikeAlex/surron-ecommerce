import { useCartAction } from './mutations/useCartAction';
import { useActiveCart } from './queries/useActiveCart';

export const useCart = () => {
  const activeCart = useActiveCart();

  const cart = activeCart.data;

  const { mutateAsync } = useCartAction();

  const get = (productId: string, variantId: number) => {
    if (!cart) return;

    return cart.lineItems.find(
      (item) => item.productId === productId && item.variant.id === variantId
    );
  };

  const has = (productId: string, variantId: number) => {
    return Boolean(get(productId, variantId));
  };

  const all = () => cart?.lineItems || [];

  const addLineItem = ({
    productId,
    variantId,
    quantity,
  }: {
    productId: string;
    variantId: number;
    quantity: number;
  }) => {
    return mutateAsync({
      action: 'addLineItem',
      productId,
      variantId,
      quantity,
    });
  };

  const deleteItem = (lineItemId: string) => {
    return mutateAsync({
      action: 'removeLineItem',
      lineItemId,
    });
  };

  const updateQuantity = (lineItemId: string, quantity: number) => {
    return mutateAsync({
      action: 'changeLineItemQuantity',
      quantity,
      lineItemId,
    });
  };

  return {
    get,
    has,
    all,
    addLineItem,
    deleteItem,
    updateQuantity,
    totalItems: cart?.lineItems.length ?? 0,
    cart,
  };
};
