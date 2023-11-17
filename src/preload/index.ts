import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { AppMeta } from '../main/api'
import type { MailOptions } from '../main/lib/email/mailer'

export const api = {
  serial: {
    listPorts: () => ipcRenderer.invoke('serial:listPorts'),
    connect: (portPath: string) => ipcRenderer.invoke('serial:connect', portPath),
    disconnect: (mangerId: string) => ipcRenderer.invoke('serial:disconnect', mangerId),
    disconnectAll: () => ipcRenderer.invoke('serial:disconnectAll'),
    startPolling: (mangerId: string) => ipcRenderer.invoke('serial:startPolling', mangerId),
    stopPolling: (mangerId: string) => ipcRenderer.invoke('serial:stopPolling', mangerId)
  },
  echo: () => ipcRenderer.invoke('echo'),
  rendererEvents: {
    listen: (channel: string, handler: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on(channel, handler)
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    }
  },
  app: {
    meta: (): Promise<AppMeta> => ipcRenderer.invoke('app:getMeta')
  },
  protocol: {
    set: (protocol, key?: string) => ipcRenderer.invoke('protocol:set', protocol, key),
    get: (key: string) => ipcRenderer.invoke('protocol:get', key),
    list: ipcRenderer.invoke('protocol:list')
  },
  email: {
    send: (mailOptions: MailOptions) => ipcRenderer.invoke('email:send', mailOptions)
  },
  logger: {
    log: (level = 'info', message: string) => ipcRenderer.invoke('logger:log', level, message)
  },
  settings: {
    set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
    /**
     * get the system setting of specific key, get all settings if `key` is omitted
     */
    get: (key?: string) => ipcRenderer.invoke('settings:get', key)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
