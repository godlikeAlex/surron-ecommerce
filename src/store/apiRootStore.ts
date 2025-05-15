import {
  getAnonymousApiRoot,
  getPasswordApiRoot,
  getRefreshTokenRoot,
} from '@/api/commercetools-api';
import { AuthFormValues } from '@/pages/Login/components';
import {
  ByProjectKeyRequestBuilder,
  Customer,
} from '@commercetools/platform-sdk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StorageApiRoot = {
  state: {
    isLoggedIn: boolean;
    refreshToken: string;
  };
};

type ApiRootState = {
  apiRoot: ByProjectKeyRequestBuilder;
  isLoggedIn: boolean;
  refreshToken?: string;
  setRefreshToken: (token?: string) => void;
  setLogin: (email: string, password: string) => void;
  setLogout: () => void;
  logIn: (user: { email: string; password: string }) => Promise<Customer>;
  handleRehydrateStorage: () => void;
};

export const LOCAL_STORAGE_KEY = 'surronc-commerce';

const initialAnonymousApiRoot = getAnonymousApiRoot();

export const useApiRootStore = create<ApiRootState>()(
  persist(
    (set, get) => ({
      apiRoot: initialAnonymousApiRoot,
      isLoggedIn: false,
      refreshToken: undefined,

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
        // 1. Получение рефреш токена через пассворд флоу
        const passwordApiRoot = getPasswordApiRoot({
          username: email,
          password,
        });
        // пробуем сделать запрос с заданными логином и паролем, если всё получится, через tokenCache произойдет обновление refreshToken и мы его заберем из стейта
        const customerResponse = await passwordApiRoot.me().get().execute();
        set({
          isLoggedIn: true,
        });
        // 5. Вернуть клиент? Может быть возвращать не клиент, а пользователя, а клиент брать отдельным вызовом
        return customerResponse.body;
      },
    }),

    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: (state) => {
        return () => state.handleRehydrateStorage();
      },
    }
  )
);

export const apiRootStore = () => useApiRootStore.getState();
