import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import {
  Container,
  Title,
  Text,
  Card,
  Skeleton,
  Space,
  Badge,
  Group,
  Stack,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import classes from './ProductDetail.module.scss';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { parseProductData } from './utils/parseProductData';
import { ProductImages } from './components/ProductImages/ProductImages';
import { ImageModal } from './components/ImageModal/ImageModal';

// /products/sur-ron-l1e-light-bee-silver
// /products/pod-zakaz-storm-bee-e-enduro

export const ProductDetail = () => {
  const { key } = useParams();
  const getProductByKey = useApiRootStore((state) => state.getProductByKey);
  const [opened, { open, close }] = useDisclosure(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    open();
  };

  const {
    data: productResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', key],
    queryFn: () => getProductByKey(key!),
    enabled: !!key,
  });

  // Parse the product data if available
  const product = productResponse
    ? parseProductData(productResponse.body)
    : null;

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={400} width="100%" />
        <Space h="md" />
        <Skeleton height={50} width="60%" />
        <Space h="md" />
        <Skeleton height={100} width="100%" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size="lg" py="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <IconInfoCircle color="red" size={24} />
            <Text color="red" size="lg">
              Error loading product:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
          </Group>
        </Card>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="lg" py="xl">
        <Text size="lg">Product not found</Text>
      </Container>
    );
  }

  return (
    <Container className={classes.container} size="xl">
      <div className={classes.productGrid}>
        {/* Product Images */}
        <Card className={classes.imageCard} p="0">
          <ProductImages
            product={product}
            handleImageClick={handleImageClick}
          />
        </Card>

        {/* Product Details */}
        <Stack className={classes.detailsContainer}>
          <Badge variant="light" color="blue" size="lg">
            {product.key || product.id}
          </Badge>

          <Title order={1} className={classes.productTitle}>
            {product.name}
          </Title>

          <Text size="lg" fw={500}>
            Product Details
          </Text>

          <Text className={classes.productDescription}>
            {product.description}
          </Text>
        </Stack>
      </div>

      <ImageModal
        opened={opened}
        close={close}
        initialSlide={initialSlide}
        product={product}
      />
    </Container>
  );
};
