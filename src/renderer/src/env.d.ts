/// <reference types="svelte" />
/// <reference types="vite/client" />

import { api } from '../../preload'

declare global {
  interface Window {
    api: typeof api
  }
}
