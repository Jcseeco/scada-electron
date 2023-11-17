import { maskNumber, unsignedToSigned } from './parser'
import type { ProtocolBody } from './protocol'

export function transform(data: Array<number>, schema: Array<ProtocolBody>) {
  const transformed = {}

  for (const partial of schema) {
    if (partial.hasOwnProperty('wordLength'))
      transformed[partial.key] = parsePartial(
        data.slice(partial.addr, partial.addr + (partial.wordLength as number)), // plus one because end address is exlcusive
        partial
      )
    else transformed[partial.key] = parsePartial(data[partial.addr], partial)
  }

  return transformed
}

function parsePartial(data: number | Array<number>, schema: ProtocolBody) {
  switch (schema.type) {
    case 'Int16BE':
      return unsignedToSigned(data as number, 16)

    case 'bit_switches':
      return parseSwitches(data as number, schema.bits as object)

    case 'UInt8BE':
      return maskNumber(data as number, 8)

    case 'UInt16BE':
    case 'array.UInt16BE':
    default:
      return data
  }
}

function parseSwitches(data: number, switchSchema: object) {
  const switches = {}

  Object.keys(switchSchema).forEach((bitIndex: string) => {
    const index = parseInt(bitIndex)

    switches[switchSchema[bitIndex]] = ((data >> index) & 1) === 1
  })

  return switches
}
