import { extractVariantsWithAttributeTypeOfSupply } from '@/utils/variant-attributes';
import { ProductVariant } from '@commercetools/platform-sdk';
import { useMemo, useState } from 'react';

type Params = {
  masterVariant: ProductVariant;
  variants: ProductVariant[];
};

export const useProductVariants = ({ masterVariant, variants }: Params) => {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    undefined
  );

  const typesOfSupply = useMemo(() => {
    const matchedVariants = extractVariantsWithAttributeTypeOfSupply(variants);

    if (matchedVariants.length === 0) return undefined;

    setSelectedVariant(matchedVariants[0].variantKey);

    return matchedVariants;
  }, [variants]);

  const variantPrices = useMemo(() => {
    const targetVariant = typesOfSupply?.find(
      ({ variantKey }) => variantKey === selectedVariant
    );

    if (targetVariant) return targetVariant.prices;
  }, [typesOfSupply, selectedVariant]);

  return {
    selectedVariant,
    setSelectedVariant,
    typesOfSupply: typesOfSupply?.map((type) => ({
      value: type.variantKey,
      label: type.variantLabel,
    })),
    variantPrices: variantPrices ?? masterVariant.prices,
  };
};
