import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const { env } = import.meta;

const projectKey = env.VAR_COMMERCE_TOOLS_PROJECT_KEY;
const region = env.VAR_COMMERCE_TOOLS_REGION;
const scopes = [env.VAR_COMMERCE_TOOLS_SCOPES];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `https://auth.${region}.commercetools.com`,
  projectKey: projectKey,
  credentials: {
    clientId: env.VAR_COMMERCE_TOOLS_CLIENT_ID,
    clientSecret: env.VAR_COMMERCE_TOOLS_CLIENT_SECRET,
  },
  scopes,
  httpClient: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `https://api.${region}.commercetools.com`,
  httpClient: fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const commerceToolsAPI = createApiBuilderFromCtpClient(
  ctpClient
).withProjectKey({
  projectKey: projectKey,
});
