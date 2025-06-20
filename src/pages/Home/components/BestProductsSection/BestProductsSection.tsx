import { useQuery } from '@tanstack/react-query';
import { BaseSection } from '../BaseSection';
import { useApiRootStore } from '@/store/apiRootStore';
import { ProductCard } from '@/pages/Catalog/components';
import { Button, Center, Loader, SimpleGrid } from '@mantine/core';
import { Link } from 'react-router';

export const BestProductsSection = () => {
  const apiRoot = useApiRootStore((store) => store.apiRoot);

  const productsQuery = useQuery({
    queryKey: ['best-products'],
    queryFn: () => {
      return apiRoot
        .productProjections()
        .get({ queryArgs: { limit: 4 } })
        .execute();
    },
  });

  return (
    <BaseSection
      title="Товары, которые выбирают наши клиенты"
      description="Мы тщательно отбираем ассортимент, чтобы вы находили только качественные и проверенные вещи. В этом разделе — товары, которые особенно полюбились нашим покупателям. Популярные модели, выгодные предложения и хиты продаж — всё, что стоит вашего внимания прямо сейчас."
    >
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }}>
        {productsQuery.isPending ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          productsQuery.data?.body.results.map((product) => (
            <ProductCard
              productKey={product.key}
              key={product.id}
              {...product}
            />
          ))
        )}
      </SimpleGrid>

      <Center mt={'xl'}>
        <Button color="yellow" component={Link} to="/catalog">
          Другие наши товары
        </Button>
      </Center>
    </BaseSection>
  );
};
