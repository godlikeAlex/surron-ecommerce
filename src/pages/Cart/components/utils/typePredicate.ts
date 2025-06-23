type Attribute = {
  key: string;
  label: string;
};

export const isAttribute = (item: unknown): item is Attribute => {
  return Boolean(
    item &&
      typeof item === 'object' &&
      'key' in item &&
      'label' in item &&
      typeof item.key === 'string' &&
      typeof item.label === 'string'
  );
};
