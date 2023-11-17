import { app, ipcMain } from 'electron'
import { listPorts } from './serial'
import { connect, disconnect, disconnectAll, startPolling, stopPolling } from './modbus-controller'
import { sendWebContents } from '..'
import {
  initProtocolStore,
  setProtocol,
  getProtocol,
  list as listProtocols
} from './protocol-controller'
import { type MailOptions, sendEmail } from '../lib/email/mailer'
import { logger } from '../lib/logger/logger'
import { set as settingsSet, get as settingsGet, initSettings } from './system-settings-controller'

export type AppMeta = {
  version: string
  name: string
  [x: string | number | symbol]: unknown
}

export const registerAPIs = function () {
  initProtocolStore()
  initSettings()

  ipcMain.handle('app:getMeta', () => {
    return {
      version: app.getVersion(),
      name: app.getName()
    }
  })

  ipcMain.handle('serial:listPorts', listPorts)

  ipcMain.handle('email:send', (_, mailOptions: MailOptions) => sendEmail(mailOptions))

  ipcMain.handle('logger:log', (_, level = 'info', message: string) => logger.log(level, message))
  /**
   * connections handle group, works with modbus-serial module
   */
  ipcMain.handle('serial:connect', (_, portPath: string) => connect(portPath))
  ipcMain.handle('serial:disconnect', (_, mangerId: string) => disconnect(mangerId))
  ipcMain.handle('serial:disconnectAll', disconnectAll)

  ipcMain.handle('serial:startPolling', (_, mangerId: string) => startPolling(mangerId))
  ipcMain.handle('serial:stopPolling', (_, mangerId: string) => stopPolling(mangerId))

  ipcMain.handle('echo', () => {
    console.log('received from renderer')
    sendWebContents('mainWindow', 'data', 'hello from main!')
  })

  ipcMain.handle('protocol:set', (_, protocol, key?) => setProtocol(protocol, key))
  ipcMain.handle('protocol:get', (_, key: string) => getProtocol(key))
  ipcMain.handle('protocol:list', listProtocols)

  ipcMain.handle('settings:set', (_, key: string, value: any) => settingsSet(key, value))
  ipcMain.handle('settings:get', (_, key?: string) => settingsGet(key))
}
