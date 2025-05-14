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

type ApiRootState = {
  apiRoot: ByProjectKeyRequestBuilder;
  isLoggedIn: boolean;
  refreshToken?: string;
  setRefreshToken: (token?: string) => void;
  setLogin: (email: string, password: string) => void;
  setLogout: () => void;
  register: (user: { email: string; password: string }) => Promise<void>;
  logIn: (user: { email: string; password: string }) => Promise<Customer>;
};

const initialApiRoot = getAnonymousApiRoot();

export const useApiRootStore = create<ApiRootState>((set, get) => ({
  apiRoot: initialApiRoot,
  isLoggedIn: false,
  refreshToken: undefined,
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
    const passwordApiRoot = getPasswordApiRoot({ username: email, password });
    // пробуем сделать запрос с заданными логином и паролем, если всё получится, через tokenCache произойдет обновление refreshToken и мы его заберем из стейта
    const customerResponse = await passwordApiRoot.me().get().execute();
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('Не получилось получить refreshToken');
    }
    // 2. Создание клиента с рефрешТокенФлоу
    const apiRoot = getRefreshTokenRoot(refreshToken);
    // 5. Обноыить текущий apiRoot тем, который работает через рефрештокенфлоу
    set({
      isLoggedIn: true,
      apiRoot,
    });
    // 5. Вернуть клиент? Может быть возвращать не клиент, а пользователя, а клиент брать отдельным вызовом
    return customerResponse.body;
  },

  register: async ({ email, password }: AuthFormValues) => {
    await initialApiRoot
      .customers()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();
  },
}));

export const apiRootStore = () => useApiRootStore.getState();
