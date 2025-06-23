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

  const [variantPrices, variantID] = useMemo(() => {
    const targetVariant = typesOfSupply?.find(
      ({ variantKey }) => variantKey === selectedVariant
    );

    if (targetVariant) return [targetVariant.prices, targetVariant.variantID];

    return [undefined, masterVariant.id];
  }, [typesOfSupply, selectedVariant, masterVariant]);

  return {
    selectedVariant,
    setSelectedVariant,
    selectedVariantID: variantID,
    typesOfSupply: typesOfSupply?.map((type) => ({
      value: type.variantKey,
      label: type.variantLabel,
    })),
    variantPrices: variantPrices ?? masterVariant.prices,
  };
};
