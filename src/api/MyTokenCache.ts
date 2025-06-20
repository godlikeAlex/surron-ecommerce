import { apiRootStore } from '@/store/apiRootStore';
import { TokenCache, TokenStore } from '@commercetools/ts-client';

export class MyTokenCache implements TokenCache {
  #tokenStore: TokenStore;

  constructor() {
    this.#tokenStore = {
      expirationTime: 0,
      refreshToken: undefined,
      token: '',
    };
  }

  public get() {
    return this.#tokenStore;
  }

  public set(tokenStore: TokenStore) {
    this.#tokenStore = tokenStore;
    apiRootStore().setRefreshToken(
      tokenStore.refreshToken,
      tokenStore.expirationTime
    );
  }
}
