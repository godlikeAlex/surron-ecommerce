import { FacetResult, RangeFacetResult } from '@commercetools/platform-sdk';

export const isRangeFacetResult = (
  facet: FacetResult | undefined
): facet is RangeFacetResult => {
  if (facet?.type !== 'range') return false;

  return true;
};
