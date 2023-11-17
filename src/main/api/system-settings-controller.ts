import { store } from '..'
import { initEmailSettings } from '../lib/email/mailer'

export function initSettings() {
  set('settings.sendEmail', initEmailSettings(store.get('settings.sendEmail')))
}

export function set(key: string, value: any): void {
  store.set(`settings.${key}`, value)
}

export function get(key?: string): unknown {
  if (key === undefined) return store.get('settings')

  return store.get(`settings.${key}`)
}
