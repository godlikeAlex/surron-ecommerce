import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { MyTokenCache } from './MyTokenCache';

const env = import.meta.env;

const projectKey = env.VAR_COMMERCE_TOOLS_PROJECT_KEY;
const region = env.VAR_COMMERCE_TOOLS_REGION;
const scopes = [env.VAR_COMMERCE_TOOLS_SCOPES];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `https://auth.${region}.commercetools.com`,
  projectKey,
  credentials: {
    clientId: env.VAR_COMMERCE_TOOLS_CLIENT_ID,
    clientSecret: env.VAR_COMMERCE_TOOLS_CLIENT_SECRET,
  },
  scopes,
  httpClient: fetch,
};

export type User = {
  username: string;
  password: string;
};

const getAuthMiddlewareOptions = () => ({
  ...authMiddlewareOptions,
  tokenCache: new MyTokenCache(),
});

const getPasswordAuthMiddlewareOptions = (user: User) => ({
  ...authMiddlewareOptions,
  credentials: { ...authMiddlewareOptions.credentials, user },
  tokenCache: new MyTokenCache(),
});

const getRefreshAuthMiddlewareOptions = (refreshToken: string) => ({
  ...authMiddlewareOptions,
  refreshToken,
  tokenCache: new MyTokenCache(),
});

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `https://api.${region}.commercetools.com`,
  httpClient: fetch,
};

export const getAnonymousApiRoot = () => {
  const ctpClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withAnonymousSessionFlow(getAuthMiddlewareOptions())
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
  });
};

export const getPasswordApiRoot = (user: User) => {
  const ctpClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withPasswordFlow(getPasswordAuthMiddlewareOptions(user))
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
  });
};

export const getRefreshTokenRoot = (refreshToken: string) => {
  const ctpClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withRefreshTokenFlow(getRefreshAuthMiddlewareOptions(refreshToken))
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
  });
};
