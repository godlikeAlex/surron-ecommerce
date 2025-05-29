import { Carousel } from '@mantine/carousel';
import classes from './ProductImages.module.scss';
import { Image, Center } from '@mantine/core';
import { ImageWithZoom } from '../ImageWithZoom/ImageWithZoom';
import { ProductType } from '../../utils/parseProductData';

type ProductImagesProps = {
  product: ProductType;
  handleImageClick: (index: number) => void;
};

export const ProductImages = ({
  product,
  handleImageClick,
}: ProductImagesProps) => {
  // Если нет изображений - показываем заглушку
  if (!product.images || product.images.length === 0) {
    return (
      <Image
        src="/placeholder-product.png"
        alt="No product image available"
        className={classes.productImage}
      />
    );
  }

  return (
    <Carousel
      withIndicators={product.images.length > 1}
      withControls={product.images.length > 1}
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        control: classes.carouselControl,
        indicator: classes.carouselIndicator,
      }}
      slideSize="100%"
      slideGap="md"
      emblaOptions={{
        loop: true,
        dragFree: false,
        align: 'center',
      }}
    >
      {product.images.map((image, index) => (
        <Carousel.Slide key={index}>
          <Center>
            <ImageWithZoom
              imageUrl={image.url}
              altText={image.label || `Product image ${index + 1}`}
              index={index}
              handleImageClick={handleImageClick}
            />
          </Center>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
