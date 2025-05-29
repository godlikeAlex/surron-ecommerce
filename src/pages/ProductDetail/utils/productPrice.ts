import { ProductVariant } from '@commercetools/platform-sdk';

export const getProductPrice = (variant: ProductVariant) => {
  return variant.prices?.[0];
};

export const formatPrice = (price?: {
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  discounted?: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
}) => {
  if (!price) return null;

  const format = (
    centAmount: number,
    currencyCode: string,
    fractionDigits: number
  ) => {
    const amount = centAmount / Math.pow(10, fractionDigits);

    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  };

  return {
    current: price.discounted
      ? format(
          price.discounted.value.centAmount,
          price.discounted.value.currencyCode,
          price.value.fractionDigits
        )
      : format(
          price.value.centAmount,
          price.value.currencyCode,
          price.value.fractionDigits
        ),
    original: price.discounted
      ? format(
          price.value.centAmount,
          price.value.currencyCode,
          price.value.fractionDigits
        )
      : null,
  };
};
