import { Product, Image as ProductImage } from '@commercetools/platform-sdk';

const getAllProductImages = (productData: Product['masterData']['current']) => {
  const images: ProductImage[] = [];

  // Add master variant images
  if (productData.masterVariant.images) {
    images.push(...productData.masterVariant.images);
  }

  // Add other variants images
  // productData.variants.forEach((variant) => {
  //   if (variant.images) {
  //     images.push(...variant.images);
  //   }
  // });

  return images;
};

export const parseProductData = (product: Product) => {
  const {
    masterData: { current },
  } = product;

  return {
    id: Number(product.id),
    key: product.key,
    name: current.name.en || Object.values(current.name)[0],
    description:
      current.description?.en ||
      (current.description
        ? Object.values(current.description)[0]
        : 'No description available'),
    images: getAllProductImages(current),
  };
};
