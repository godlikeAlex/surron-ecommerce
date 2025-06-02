import { Input, InputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

type Props = InputProps & {
  onSearch: (value: string) => void;
  defaultValue: string;
};

export const DebounceSearch = ({ onSearch, defaultValue, ...props }: Props) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSearch = useDebouncedCallback((searchQuery: string) => {
    onSearch(searchQuery);
  }, 800);

  const handleChange = (text: string) => {
    setValue(text);
    handleSearch(text);
  };

  return (
    <Input
      placeholder="Найти товары"
      size="sm"
      leftSection={<IconSearch />}
      defaultValue={defaultValue || ''}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      {...props}
    />
  );
};
