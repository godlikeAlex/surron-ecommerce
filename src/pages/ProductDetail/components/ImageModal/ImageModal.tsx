import { Image, Modal, FocusTrap } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react';
import classes from './ImageModal.module.scss';
import { Carousel } from '@mantine/carousel';
import { ProductType } from '../../utils/parseProductData';

type ImageModalProps = {
  opened: boolean;
  close: () => void;
  initialSlide: number;
  product: ProductType;
};

export const ImageModal = ({
  opened,
  close,
  initialSlide,
  product,
}: ImageModalProps) => {
  if (!product.images || product.images.length === 0) {
    return;
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="xl"
      fullScreen
      padding={0}
      withCloseButton={false}
      z-index={90}
      styles={{
        content: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <FocusTrap.InitialFocus />
      <div className={classes.modalSliderContainer}>
        <button
          className={classes.closeButton}
          onClick={close}
          aria-label="Close modal"
        >
          <IconX size={24} strokeWidth={2} />
        </button>

        <Carousel
          initialSlide={initialSlide}
          withIndicators={product.images.length > 1}
          withControls={product.images.length > 1}
          slideSize="100%"
          emblaOptions={{
            loop: true,
            dragFree: false,
            align: 'center',
          }}
          classNames={{
            root: classes.modalCarousel,
            control: classes.carouselControl,
          }}
          nextControlIcon={<IconArrowRight size={24} />}
          previousControlIcon={<IconArrowLeft size={24} />}
        >
          {product.images.map((image, index) => (
            <Carousel.Slide key={index}>
              <div className={classes.modalSlide}>
                <Image
                  src={image.url}
                  alt={image.label || `Product image ${index + 1}`}
                  fit="contain"
                  className={classes.modalImage}
                />
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Modal>
  );
};
