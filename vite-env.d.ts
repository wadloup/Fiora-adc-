/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COME_HOME_BACKGROUND_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
