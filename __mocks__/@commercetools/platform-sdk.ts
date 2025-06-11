import { vi } from 'vitest';

const productProjectionsMock = {
  search: () => ({
    get: productProjectionsMock.get,
  }),
  get: vi.fn(() => ({
    execute: productProjectionsMock.execute,
  })),
  execute: vi.fn(() => {
    return Promise.resolve({
      body: {
        results: [{ id: '1', name: { en: 'Mocked product' } }],
      },
    });
  }),
};

export const createApiBuilderFromCtpClient = () => ({
  withProjectKey: () => ({
    productProjections: () => ({
      search: productProjectionsMock.search,
    }),
  }),
});

export const commercetoolsSDK = {
  productProjections: {
    get: productProjectionsMock.get,
    execute: productProjectionsMock.execute,
  },
};
