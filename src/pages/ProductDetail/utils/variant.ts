import { ProductVariant } from '@commercetools/platform-sdk';

export const getVariantAttrLabel = (variant: ProductVariant) => {
  return (
    variant.attributes?.find((attr) => attr.name === 'tip-postavki')?.value as {
      key: string;
      label: string;
    }
  ).label;
};
