import classes from './ImageWithZoom.module.scss';
import { Image, Box } from '@mantine/core';
import { IconZoomIn } from '@tabler/icons-react';

type ImageWithZoomProps = {
  imageUrl: string;
  altText: string;
  index: number;
  handleImageClick: (i: number) => void;
};

export const ImageWithZoom = ({
  imageUrl,
  altText,
  index,
  handleImageClick,
}: ImageWithZoomProps) => (
  <Box className={classes.imageWrapper} onClick={() => handleImageClick(index)}>
    <Image src={imageUrl} alt={altText} className={classes.productImage} />
    <Box className={classes.zoomIndicator}>
      <IconZoomIn />
    </Box>
  </Box>
);
