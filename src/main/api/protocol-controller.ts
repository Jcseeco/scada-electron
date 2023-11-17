import { protocol, type Protocol } from '../lib/protocol'
import { store } from '../index'
import { uniqueId } from '../lib/utils'

export function initProtocolStore() {
  // initialize if default protocol not exists in store
  if (!store.get('protocols')) {
    setProtocol(protocol, 'default')
  }
}

export function list() {
  return store.get('protocols')
}

export function setProtocol(protocol: Protocol, key?: string) {
  const protocols: { [x: string]: Protocol } =
    (store.get('protocols') as { [x: string]: Protocol }) ?? {}

  const protocolId: string = key ?? uniqueId()

  protocols[protocolId] = protocol
  store.set('protocols', protocols)
}

export function getProtocol(key: string) {
  return store.get(`protocols.${key}`)
}
