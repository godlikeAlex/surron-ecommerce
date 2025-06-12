import { ProductVariant } from '@commercetools/platform-sdk';
import { ProductType } from './parseProductData';

export const getVariantAttrLabel = (variant: ProductVariant) => {
  return (
    variant.attributes?.find((attr) => attr.name === 'tip-postavki')?.value as {
      key: string;
      label: string;
    }
  ).label;
};

export const getVariantsWithTipPostavki = (product: ProductType) =>
  product.variants.filter((v) =>
    v.attributes?.some(({ name }) => name === 'tip-postavki')
  );
