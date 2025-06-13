import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@/tests/utils';
import { commercetoolsSDK } from '@modules-mocks/@commercetools/platform-sdk';
import { useCategories } from '../useCategories';

vi.mock('@commercetools/platform-sdk');

describe('hook useCategories', () => {
  it('should return the correct properties', () => {
    expect.hasAssertions();

    const { result } = renderHook(() => useCategories([]));

    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('categories');
    expect(result.current).toHaveProperty('activeCategories');
    expect(result.current).toHaveProperty('isIncorectCategoriesPath');
    expect(result.current.isPending).toBe(true);
  });

  it('should return correct categories', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => useCategories([]));
    console.log(result.current);

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isIncorectCategoriesPath).toBe(false);
    expect(result.current.categories).toHaveLength(1);
  });

  it('should return correct activeCategories', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => useCategories(['sur-ron-hyper-bee']));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isIncorectCategoriesPath).toBe(false);
    expect(result.current.activeCategories[0].isActive).toBe(true);
    expect(result.current.activeCategories).toHaveLength(1);
    expect(result.current.categories).toHaveLength(1);
  });

  it('should isIncorectCategoriesPath eqauls false if wrong category path', async () => {
    expect.hasAssertions();

    const { result } = renderHook(() =>
      useCategories(['sur-ron-hyper-bee-wrong'])
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isIncorectCategoriesPath).toBe(true);
  });

  it('should correct parse sub categories', async () => {
    expect.hasAssertions();

    commercetoolsSDK.categories.execute.mockResolvedValueOnce({
      body: {
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
        results: [
          {
            id: 'aa99ea47-e565-4090-a4ed-95c6df2aabf4',
            version: 2,
            versionModifiedAt: '2025-06-02T08:11:19.086Z',
            lastMessageSequenceNumber: 1,
            createdAt: '2025-06-02T08:10:31.843Z',
            lastModifiedAt: '2025-06-02T08:11:19.086Z',
            lastModifiedBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: '02d2a235-4d1f-44f2-8a4e-a11ab965b46c',
              },
            },
            createdBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: '02d2a235-4d1f-44f2-8a4e-a11ab965b46c',
              },
            },
            name: {
              ru: 'Аксессуары',
            },
            slug: {
              ru: 'accessories',
            },
            orderHint: '0.09',
            assets: [],
          },
          {
            id: 'a7416a0d-f4de-4cec-8b3e-304bbaa99229',
            version: 1,
            versionModifiedAt: '2025-06-02T08:11:06.464Z',
            lastMessageSequenceNumber: 1,
            createdAt: '2025-06-02T08:11:06.464Z',
            lastModifiedAt: '2025-06-02T08:11:06.464Z',
            lastModifiedBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: '02d2a235-4d1f-44f2-8a4e-a11ab965b46c',
              },
            },
            createdBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: '02d2a235-4d1f-44f2-8a4e-a11ab965b46c',
              },
            },
            name: {
              ru: 'Наклейки',
            },
            slug: {
              ru: 'nakleyki',
            },
            parent: {
              typeId: 'category',
              id: 'aa99ea47-e565-4090-a4ed-95c6df2aabf4',
            },
            orderHint: '0',
            assets: [],
          },
        ],
      },
    });

    const { result } = renderHook(() => useCategories(['accessories']));

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isIncorectCategoriesPath).toBe(false);
    expect(result.current.categories[0].children).toHaveLength(1);
    expect(result.current.categories[0].children[0].id).toBe(
      'a7416a0d-f4de-4cec-8b3e-304bbaa99229'
    );
  });
});
