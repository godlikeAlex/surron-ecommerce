import { FacetResult, TermFacetResult } from '@commercetools/platform-sdk';

export const isTermFacetResult = (
  facet?: FacetResult
): facet is TermFacetResult => {
  return facet?.type === 'terms';
};
