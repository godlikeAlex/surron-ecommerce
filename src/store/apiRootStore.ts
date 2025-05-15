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
import { checkStorage } from './storage/apiRootStorage';

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
  fromStorage: (value: StorageApiRoot) => void;
  obtainToken: () => Promise<void>;
  logIn: (user: { email: string; password: string }) => Promise<Customer>;
};

export const LOCAL_STORAGE_KEY =
  'surronc-commerce_Lorenzo-StJohn_Milena-Belianova_godlikeAlex';

const storageItem = checkStorage();

const initialApiRoot = storageItem
  ? getRefreshTokenRoot(storageItem.state.refreshToken)
  : getAnonymousApiRoot();

const initialIsLoggedIn = storageItem ? storageItem.state.isLoggedIn : false;

const initialRefreshToken = storageItem
  ? storageItem.state.refreshToken
  : undefined;

export const useApiRootStore = create<ApiRootState>()(
  persist(
    (set, get) => ({
      apiRoot: initialApiRoot,
      isLoggedIn: initialIsLoggedIn,
      refreshToken: initialRefreshToken,

      fromStorage: (value) => {
        set({
          isLoggedIn: value.state.isLoggedIn,
          refreshToken: value.state.refreshToken,
          apiRoot: getRefreshTokenRoot(value.state.refreshToken),
        });
      },

      obtainToken: async () => {
        try {
          await get().apiRoot.categories().get().execute();
        } catch (error) {
          if (error) console.log();
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
      },

      setLogout: () => {
        set({
          isLoggedIn: false,
          refreshToken: undefined,
          apiRoot: getAnonymousApiRoot(),
        });
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
    }
  )
);

export const apiRootStore = () => useApiRootStore.getState();
