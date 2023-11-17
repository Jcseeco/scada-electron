interface ImportMetaEnv {
  readonly MAIN_VITE_EMAIL_USER: string
  readonly MAIN_VITE_EMAIL_PASSWORD: string
  readonly MAIN_VITE_EMAIL_TARGET: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
