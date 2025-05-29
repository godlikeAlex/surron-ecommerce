import { Product, ProductVariant } from '@commercetools/platform-sdk';

export type ProductType = {
  id: number;
  key?: string;
  name: string;
  description: string;
  images: {
    url: string;
    label?: string;
  }[];
  variant: ProductVariant;
};

export const parseProductData = (product: Product): ProductType => {
  const {
    masterData: { current },
  } = product;

  const masterVariant = current.masterVariant;

  return {
    id: Number(product.id),
    key: product.key,
    name: current.name.en || Object.values(current.name)[0],
    description:
      current.description?.en ||
      (current.description ? Object.values(current.description)[0] : ''),
    images: masterVariant.images || [],
    variant: masterVariant,
  };
};
