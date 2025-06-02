import { useApiRootStore } from '@/store/apiRootStore';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import {
  Container,
  Text,
  Card,
  Skeleton,
  Group,
  Stack,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import classes from './ProductDetail.module.scss';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { parseProductData } from './utils/parseProductData';
import { ProductImages } from './components/ProductImages/ProductImages';
import { ImageModal } from './components/ImageModal/ImageModal';
import { ProductDetails } from './components/ProductDetails/ProductDetails';
import { ProductDescription } from './components';

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
    queryFn: () => (key ? getProductByKey(key) : null),
    enabled: !!key,
  });

  const product = productResponse
    ? parseProductData(productResponse.body)
    : null;

  if (isLoading) {
    return (
      <Container
        size="xl"
        style={{
          padding: '76px 20px 20px',
        }}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" py="xl">
          <Skeleton height={450} />

          <Stack>
            <Skeleton height={44} width="100%" />
            <Skeleton height={390} width="100%" />
          </Stack>
        </SimpleGrid>
        <Skeleton height={350} width="100%" mt={'xl'} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          padding: '76px 20px 20px',
        }}
        size="lg"
        py="xl"
      >
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
        <ProductDetails product={product} />
      </div>
      <Box mt={'xl'}>
        {/* Product Additional Info, characteristics*/}
        <ProductDescription product={product} />
      </Box>

      <ImageModal
        opened={opened}
        close={close}
        initialSlide={initialSlide}
        product={product}
      />
    </Container>
  );
};
