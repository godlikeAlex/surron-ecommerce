import { Select } from '@mantine/core';
import { useCatalogQueryParams } from '@/pages/Catalog/hooks/useCatalogQueryParams';

const options = [
  { label: 'Подороже', value: 'price desc' },
  { label: 'Подешевле', value: 'price asc' },
  { label: 'По имени', value: 'name.ru asc' },
];

export const SortOptions = () => {
  const { setCatalogQueryParams, sort } = useCatalogQueryParams();

  return (
    <Select
      size="xs"
      label="Сортировка"
      value={sort}
      onChange={(value) => value && setCatalogQueryParams({ sort: value })}
      data={options}
    />
  );
};
