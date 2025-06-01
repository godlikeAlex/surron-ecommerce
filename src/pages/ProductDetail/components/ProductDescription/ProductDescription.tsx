import { Group, Tabs, Text } from '@mantine/core';
import { ProductType } from '../../utils/parseProductData';
import { getVariantAttrLabel } from '../../utils/variant';

type ProductDescriptionProps = {
  product: ProductType;
};

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  return (
    <Tabs color="yellow" defaultValue="gallery">
      <Tabs.List fs={'xl'}>
        <Tabs.Tab
          value="gallery"
          // leftSection={<IconPhoto size={12} />}
        >
          Технические характеристики
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          // leftSection={<IconMessageCircle size={12} />}
        >
          Детали
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" p={'md'}>
        -
      </Tabs.Panel>

      <Tabs.Panel value="messages" p={'md'}>
        <Group gap={4}>
          <Text span fw={500} mr={'xs'}>
            Тип поставки:
          </Text>
          {product.variants.map((variant, index) => (
            <Text span key={variant.key}>
              {getVariantAttrLabel(variant)}
              {index < product.variants.length - 1 && ','}
            </Text>
          ))}
        </Group>
      </Tabs.Panel>
    </Tabs>
  );
};
