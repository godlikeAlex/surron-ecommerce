import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@/tests/utils';
import { useProductFilters } from '../useProductFilters';
import { commercetoolsSDK } from '@modules-mocks/@commercetools/platform-sdk';

vi.mock('@commercetools/platform-sdk');

describe('hook useProductFilters', () => {
  it('should return isPending, isError when products not loaded', () => {
    expect.hasAssertions();

    const { result } = renderHook(() => useProductFilters({}));

    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('isError');
    expect(result.current.isPending).toBe(true);
  });

  it('should return correct filters', async () => {
    expect.hasAssertions();

    commercetoolsSDK.productProjections.execute.mockResolvedValueOnce({
      body: {
        limit: 25,
        offset: 0,
        count: 0,
        total: 30,
        results: [],
        facets: {
          priceRange: {
            type: 'range',
            dataType: 'number',
            ranges: [
              {
                type: 'double',
                from: 0,
                fromStr: '0.0',
                to: 0,
                toStr: '',
                count: 75,
                totalCount: 75,
                total: 3094325000,
                min: 1350000,
                max: 88900000,
                mean: 41257666.666666664,
              },
            ],
          },
          colors: {
            type: 'terms',
            dataType: 'text',
            missing: 31,
            total: 44,
            other: 0,
            terms: [
              {
                term: 'dimgray',
                count: 11,
              },
              {
                term: 'yellow',
                count: 8,
              },
              {
                term: 'deepskyblue',
                count: 6,
              },
              {
                term: 'green',
                count: 4,
              },
              {
                term: 'indigo',
                count: 3,
              },
              {
                term: 'silver',
                count: 2,
              },
              {
                term: 'red',
                count: 2,
              },
              {
                term: 'pink',
                count: 2,
              },
              {
                term: 'darkblue',
                count: 2,
              },
              {
                term: 'burlywood',
                count: 2,
              },
              {
                term: 'blue',
                count: 1,
              },
              {
                term: 'black',
                count: 1,
              },
            ],
          },
          chargeTime: {
            type: 'terms',
            dataType: 'text',
            missing: 35,
            total: 40,
            other: 0,
            terms: [
              {
                term: '3',
                count: 14,
              },
              {
                term: '2',
                count: 13,
              },
              {
                term: '4',
                count: 6,
              },
              {
                term: '5',
                count: 5,
              },
              {
                term: '8',
                count: 2,
              },
            ],
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useProductFilters({
        category: {
          id: '23',
          name: 'example',
          slug: 'example-slug',
          isActive: false,
          children: [],
        },
      })
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current).toHaveProperty('filters');
    expect(result.current.filters?.colors).toStrictEqual([
      'dimgray',
      'yellow',
      'deepskyblue',
      'green',
      'indigo',
      'silver',
      'red',
      'pink',
      'darkblue',
      'burlywood',
      'blue',
      'black',
    ]);
    expect(result.current.filters?.chargeTime).toStrictEqual([
      '2',
      '3',
      '4',
      '5',
      '8',
    ]);
    expect(result.current.filters?.price).toBeDefined();
  });

  it('should return empty filters if it not present', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useProductFilters({
        category: {
          id: '23',
          name: 'example',
          slug: 'example-slug',
          isActive: false,
          children: [],
        },
      })
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.filters?.price).toBeUndefined();
    expect(result.current.filters?.colors).toBeUndefined();
    expect(result.current.filters?.chargeTime).toBeUndefined();
  });
});
