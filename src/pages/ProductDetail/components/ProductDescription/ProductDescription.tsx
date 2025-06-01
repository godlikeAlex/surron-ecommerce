import { Group, Table, Tabs, Text } from '@mantine/core';
import { ProductType } from '../../utils/parseProductData';
import { getVariantAttrLabel } from '../../utils/variant';
import { specs } from '../../specs/specs';

type ProductDescriptionProps = {
  product: ProductType;
};

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const productSpecs = specs[product.category.id] || null;

  return (
    <Tabs color="yellow" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">Технические характеристики</Tabs.Tab>
        <Tabs.Tab value="messages">Детали</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" p={'md'}>
        {productSpecs ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>Параметры</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>
                  <Text fw={700}>{product.name}</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {productSpecs.specifications.map((spec) => (
                <Table.Tr key={spec.parameter}>
                  <Table.Td>{spec.parameter}</Table.Td>
                  <Table.Td>
                    <Text>{spec.value}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text>-</Text>
        )}
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
