import classes from './ImageWithZoom.module.scss';
import { Image, Box } from '@mantine/core';
import { IconZoomIn } from '@tabler/icons-react';

type ImageWithZoomProps = {
  imageUrl: string;
  altText: string;
  handleImageClick: (s: string) => void;
};

export const ImageWithZoom = ({
  imageUrl,
  altText,
  handleImageClick,
}: ImageWithZoomProps) => (
  <Box
    className={classes.imageWrapper}
    onClick={() => handleImageClick(imageUrl)}
  >
    <Image src={imageUrl} alt={altText} className={classes.productImage} />
    <Box className={classes.zoomIndicator}>
      <IconZoomIn />
    </Box>
  </Box>
);
