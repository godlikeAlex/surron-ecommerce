import {
  getAnonymousApiRoot,
  getPasswordApiRoot,
  getRefreshTokenRoot,
} from '@/api/commercetools-api';
import { AuthFormValues } from '@/pages/Login/components';
import {
  ByProjectKeyRequestBuilder,
  Cart,
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
  cart?: Cart;
  setCart: (cart: Cart) => void;
  totalCart: number;
  setTotalCart: (total: number) => void;
  cartId: string;
  setCartId: (cardId: string) => void;
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
      cart: undefined,
      totalCart: 0,
      cartId: '',

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

      setTotalCart: (newTotal) => {
        set({ totalCart: newTotal });
      },

      setCartId: (newId) => {
        set({ cartId: newId });
      },

      setCart: (cart) => {
        set({ cart });
      },

      setLogin: (email, password) => {
        try {
          const login = async () => {
            if (get().cartId)
              await get()
                .apiRoot.login()
                .post({
                  body: {
                    email,
                    password,
                    anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
                    anonymousCart: {
                      id: get().cartId,
                      typeId: 'cart',
                    },
                  },
                  headers: {},
                })
                .execute();
            set({
              isLoggedIn: true,
              refreshToken: undefined,
              apiRoot: getPasswordApiRoot({ username: email, password }),
            });
            const cart = async () => {
              const response = await get().apiRoot.me().carts().get().execute();
              set({
                totalCart:
                  response.body.results?.[0]?.totalLineItemQuantity ?? 0,
              });
            };
            await cart();
          };
          void login();
        } catch (error) {
          if (error) console.log();
        }
      },

      setLogout: () => {
        set({
          isLoggedIn: false,
          refreshToken: undefined,
          apiRoot: getAnonymousApiRoot(),
          customer: undefined,
          totalCart: 0,
          cartId: '',
        });
        try {
          void get().apiRoot.categories().get().execute();
        } catch (error) {
          if (error) console.log();
        }
      },

      logIn: async ({ email, password }: AuthFormValues): Promise<Customer> => {
        if (get().cartId)
          await get()
            .apiRoot.login()
            .post({
              body: {
                email,
                password,
                anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
                anonymousCart: {
                  id: get().cartId,
                  typeId: 'cart',
                },
              },
              headers: {},
            })
            .execute();
        const passwordApiRoot = getPasswordApiRoot({
          username: email,
          password,
        });
        const customerResponse = await passwordApiRoot.me().get().execute();
        set({
          isLoggedIn: true,
          customer: customerResponse.body,
        });
        const cart = async () => {
          const response = await get().apiRoot.me().carts().get().execute();
          set({
            totalCart: response.body.results?.[0]?.totalLineItemQuantity ?? 0,
          });
        };
        void cart();
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
        totalCart: state.totalCart,
        cartId: state.cartId,
      }),
      onRehydrateStorage: (state) => {
        return () => state.handleRehydrateStorage();
      },
    }
  )
);

export const apiRootStore = () => useApiRootStore.getState();
