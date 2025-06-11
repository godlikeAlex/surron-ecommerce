import {
  getAnonymousApiRoot,
  getPasswordApiRoot,
  getRefreshTokenRoot,
} from '@/api/commercetools-api';
import { AuthFormValues } from '@/pages/Login/components';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Customer,
  Product,
} from '@commercetools/platform-sdk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ApiRootState = {
  apiRoot: ByProjectKeyRequestBuilder;
  isLoggedIn: boolean;
  refreshToken?: string;
  setRefreshToken: (token?: string) => void;
  setLogin: (email: string, password: string) => void;
  setLogout: () => void;
  logIn: (user: { email: string; password: string }) => Promise<Customer>;
  getProductByKey: (productKey: string) => Promise<ClientResponse<Product>>;
  handleRehydrateStorage: () => void;
  version: number;
  setVersion: (version: number) => void;
  customer?: Customer;
};

export const LOCAL_STORAGE_KEY = 'surronc-commerce';

const initialAnonymousApiRoot = getAnonymousApiRoot();

export const useApiRootStore = create<ApiRootState>()(
  persist(
    (set, get) => ({
      apiRoot: initialAnonymousApiRoot,
      isLoggedIn: false,
      refreshToken: undefined,
      version: 1,
      customer: undefined,

      handleRehydrateStorage: () => {
        const token = get().refreshToken;
        if (token) {
          set({ apiRoot: getRefreshTokenRoot(token) });
        }
      },

      setRefreshToken: (token) => {
        if (token && token !== get().refreshToken)
          set({ refreshToken: token, apiRoot: getRefreshTokenRoot(token) });
      },

      setVersion: (newVersion) => {
        set({ version: newVersion });
      },

      setLogin: (email, password) => {
        set({
          isLoggedIn: true,
          refreshToken: undefined,
          apiRoot: getPasswordApiRoot({ username: email, password }),
        });
        try {
          void get().apiRoot.categories().get().execute();
        } catch (error) {
          if (error) console.log();
        }
      },

      setLogout: () => {
        set({
          isLoggedIn: false,
          refreshToken: undefined,
          apiRoot: getAnonymousApiRoot(),
        });
        try {
          void get().apiRoot.categories().get().execute();
        } catch (error) {
          if (error) console.log();
        }
      },

      logIn: async ({ email, password }: AuthFormValues): Promise<Customer> => {
        const passwordApiRoot = getPasswordApiRoot({
          username: email,
          password,
        });
        const customerResponse = await passwordApiRoot.me().get().execute();
        set({
          isLoggedIn: true,
          customer: customerResponse.body,
        });
        return customerResponse.body;
      },

      getProductByKey: (productKey: string) =>
        get().apiRoot.products().withKey({ key: productKey }).get().execute(),
    }),

    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        refreshToken: state.refreshToken,
        version: state.version,
      }),
      onRehydrateStorage: (state) => {
        return () => state.handleRehydrateStorage();
      },
    }
  )
);

export const apiRootStore = () => useApiRootStore.getState();
