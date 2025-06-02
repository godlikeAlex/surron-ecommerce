import { FacetResult, RangeFacetResult } from '@commercetools/platform-sdk';

export const isRangeFacetResult = (
  facet: FacetResult | undefined
): facet is RangeFacetResult => {
  return facet?.type === 'range';
};
