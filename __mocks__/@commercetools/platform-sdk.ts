import { vi } from 'vitest';

type ProductProjectionResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: unknown[];
  facets?: Record<string, unknown>;
};

type CategoriesResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: unknown[];
};

const productProjectionsMock = {
  search: () => ({
    get: productProjectionsMock.get,
  }),
  get: vi.fn(() => ({
    execute: productProjectionsMock.execute,
  })),
  execute: vi.fn<() => Promise<{ body: ProductProjectionResponse }>>(() => {
    return Promise.resolve({
      body: {
        limit: 0,
        offset: 0,
        count: 0,
        total: 30,
        results: [],
      },
    });
  }),
};

const categoriesMock = {
  get: vi.fn(() => ({
    execute: categoriesMock.execute,
  })),
  execute: vi.fn<() => Promise<{ body: CategoriesResponse }>>(() => {
    return Promise.resolve({
      body: {
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
        results: [
          {
            id: '80bb22b4-2710-4c3c-ad5d-b1819c08db80',
            version: 3,
            versionModifiedAt: '2025-06-01T13:11:18.573Z',
            lastMessageSequenceNumber: 1,
            createdAt: '2025-05-05T14:36:06.142Z',
            lastModifiedAt: '2025-06-01T13:11:18.573Z',
            lastModifiedBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: 'afea83b8-889e-4901-af1b-a25d12d23ee0',
              },
            },
            createdBy: {
              isPlatformClient: true,
              user: {
                typeId: 'user',
                id: 'afea83b8-889e-4901-af1b-a25d12d23ee0',
              },
            },
            key: 'sur-ron-hyper-bee',
            name: {
              ru: 'SUR-RON HYPER BEE',
            },
            slug: {
              ru: 'sur-ron-hyper-bee',
            },
            ancestors: [],
            parent: undefined,
            orderHint: '0.01',
            externalId: 'sur-ron-hyper-bee',
            assets: [],
          },
        ],
      },
    });
  }),
};

export const createApiBuilderFromCtpClient = () => ({
  withProjectKey: () => ({
    productProjections: () => ({
      search: productProjectionsMock.search,
    }),
    categories: () => ({
      get: categoriesMock.get,
    }),
  }),
});

export const commercetoolsSDK = {
  productProjections: {
    get: productProjectionsMock.get,
    execute: productProjectionsMock.execute,
  },
  categories: {
    get: categoriesMock.get,
    execute: categoriesMock.execute,
  },
};
