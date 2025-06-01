import { Input, InputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

type Props = InputProps & {
  onSearch: (value: string) => void;
  defaultValue: string;
};

export const DebounceSearch = ({ onSearch, defaultValue, ...props }: Props) => {
  const handleSearch = useDebouncedCallback((searchQuery: string) => {
    onSearch(searchQuery);
  }, 500);

  return (
    <Input
      placeholder="Найти товары"
      size="xs"
      leftSection={<IconSearch />}
      defaultValue={defaultValue || ''}
      onChange={(e) => handleSearch(e.target.value)}
      {...props}
    />
  );
};
