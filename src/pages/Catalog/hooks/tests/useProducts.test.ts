import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@/tests/utils';
import { useProducts } from '../useProducts';
import { commercetoolsSDK } from '@modules-mocks/@commercetools/platform-sdk';

vi.mock('@commercetools/platform-sdk');

describe('hook useProducts', () => {
  it('should return isPending and isError when products not loaded', () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useProducts({ page: 1, sort: 'name.ru asc' })
    );

    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('isError');
  });

  it('should return products, isPending: false, isError: false when products fetched', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useProducts({ page: 1, sort: 'name.ru asc' })
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(commercetoolsSDK.productProjections.execute).toHaveBeenCalledWith();

    expect(result.current.isError).toBe(false);
    expect(result.current).toHaveProperty('products');
  });

  it('should apply filters to api call', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useProducts({
        page: 1,
        sort: 'name.ru asc',
        colors: ['red'],
        priceRange: { from: 100, to: 200 },
        search: 'example',
        chargeTime: ['1h'],
        category: {
          id: '23',
          name: 'example',
          slug: 'example-slug',
          isActive: false,
          children: [],
        },
      })
    );

    const appliedFilters = [
      'categories.id: "23"',
      'variants.price.centAmount: range(10000 to 20000)',
      'variants.attributes.color.key: "red"',
      'variants.attributes.vremya-zaryadki.key: "1h"',
    ];

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(commercetoolsSDK.productProjections.get).toHaveBeenCalledWith({
      queryArgs: {
        facet: ['variants.price.centAmount: range(0 to *)'],
        'filter.query': appliedFilters,
        fuzzy: true,
        limit: 6,
        markMatchingVariants: true,
        offset: 0,
        sort: 'name.ru asc',
        'text.ru': 'example',
      },
    });

    expect(result.current.isError).toBe(false);
    expect(result.current).toHaveProperty('products');
  });
});
