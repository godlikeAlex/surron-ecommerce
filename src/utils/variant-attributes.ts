import { ProductVariant } from '@commercetools/platform-sdk';
import { z } from 'zod/v4';

const AttributeSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('tip-postavki'),
    value: z.discriminatedUnion('key', [
      z.object({ key: z.literal('v-nalichii'), label: z.string() }),
      z.object({ key: z.literal('pod-zakaz'), label: z.string() }),
    ]),
  }),
  z.object({
    name: z.literal('color'),
    value: z.object({ key: z.string(), label: z.string() }),
  }),
  z.object({
    name: z.literal('vremya-zaryadki'),
    value: z.object({ key: z.string(), label: z.string() }),
  }),
]);

const ProductVariantSchema = z.object({
  id: z.number(),
  sku: z.string().optional(),
  key: z.string().optional(),
  attributes: z.array(AttributeSchema).optional(),
  prices: z.array(z.any()),
});

export const extractVariantsWithAttributeTypeOfSupply = (
  variants: ProductVariant[]
) => {
  const acceptedVariants = [];

  for (const variant of variants) {
    const result = ProductVariantSchema.extend({
      attributes: z.array(AttributeSchema),
    }).safeParse(variant);

    if (!result.success) continue;

    const typeOfSupplyAttribute = result.data.attributes.find(
      (attribute) => attribute.name === 'tip-postavki'
    );

    if (!typeOfSupplyAttribute) continue;

    acceptedVariants.push({
      variantKey: typeOfSupplyAttribute.value.key,
      variantLabel: typeOfSupplyAttribute.value.label,
      prices: variant.prices,
    });
  }

  return acceptedVariants;
};
