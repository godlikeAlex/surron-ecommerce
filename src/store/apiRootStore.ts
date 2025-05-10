import {
  getAnonymousApiRoot,
  getPasswordApiRoot,
  getRefreshTokenRoot,
} from '@/api/commercetools-api';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { create } from 'zustand';

type ApiRootState = {
  apiRoot: ByProjectKeyRequestBuilder;
  isLoggedIn: boolean;
  refreshToken: string | undefined;
  setRefreshToken: (token: string | undefined) => void;
  setLogin: (email: string, password: string) => void;
  setLogout: () => void;
};

const initialApiRoot = getAnonymousApiRoot();

const useApiRootStore = create<ApiRootState>((set, get) => ({
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
}));

export const apiRootStore = () => useApiRootStore.getState();
