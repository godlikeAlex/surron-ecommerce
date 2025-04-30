/// <reference types="vite/client" />

interface ImportMetaEnv {
  VAR_COMMERCE_TOOLS_PROJECT_KEY: string;
  VAR_COMMERCE_TOOLS_CLIENT_ID: string;
  VAR_COMMERCE_TOOLS_CLIENT_SECRET: string;
  VAR_COMMERCE_TOOLS_REGION: string;
  VAR_COMMERCE_TOOLS_SCOPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
