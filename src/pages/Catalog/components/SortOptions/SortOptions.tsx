import { Select } from '@mantine/core';

type Props = {
  sort: string;
  onChange: (sort: string) => void;
};

const options = [
  { label: 'Подороже', value: 'price desc' },
  { label: 'Подешевле', value: 'price asc' },
  { label: 'По имени', value: 'name.ru asc' },
];

export const SortOptions = ({ onChange, sort }: Props) => {
  return (
    <Select
      size="xs"
      placeholder="Сортировать по"
      value={sort}
      onChange={(value) => value && onChange(value)}
      data={options}
    />
  );
};
