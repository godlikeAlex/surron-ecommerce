/// <reference types="vite/client" />

interface ImportMetaEnv {
  VAR_COMMERCE_TOOLS_HOST: string;
  VAR_COMMERCE_TOOLS_PROJECT_KEY: string;
  VAR_COMMERCE_TOOLS_CLIENT_ID: string;
  VAR_COMMERCE_TOOLS_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
