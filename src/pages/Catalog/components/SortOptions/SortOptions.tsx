import { Select } from '@mantine/core';
import { z } from 'zod/v4';
import { SortSchema } from '@/pages/Catalog/hooks/useCatalogQueryParams';

type Props = {
  sort: z.infer<typeof SortSchema>;
  onChange: (sort: z.infer<typeof SortSchema>) => void;
};

const options: Array<{ label: string; value: z.infer<typeof SortSchema> }> = [
  { label: 'Подороже', value: 'price desc' },
  { label: 'Подешевле', value: 'price asc' },
  { label: 'По имени', value: 'name.ru asc' },
];

export const SortOptions = ({ onChange, sort }: Props) => {
  const handleChange = (sortValue: string) => {
    const result = SortSchema.safeParse(sortValue);

    if (result.success) onChange(result.data);
  };

  return (
    <Select
      size="xs"
      placeholder="Сортировать по"
      value={sort}
      onChange={(_value, option) => handleChange(option.value)}
      data={options}
    />
  );
};
