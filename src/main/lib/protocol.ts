export type Protocol = {
  meta: {
    name: string
    slaveIds: Array<number>
    baudRate: number
    dataBits: 8 | 7 | 6
    parity: 'none' | 'even' | 'odd'
    stopBits: 1 | 2
    scanRate: number
    [x: string | number | symbol]: unknown
  }
  body: Array<ProtocolBodies>
}

export type ProtocolBodies = {
  meta: {
    startAddr: number
    quantity: number
    [x: string | number | symbol]: unknown
  }
  schema: Array<ProtocolBody>
}

export type ProtocolBody = {
  name?: string
  key: string
  type: string
  unit?: string
  mask?: string
  addr: number
  wordLength?: number
  byteLength?: number
  bitLength?: number
  [x: string | number | symbol]: unknown
}

// export const protocol: Protocol = {
//   meta: {
//     startAddr: 0,
//     length: 169
//   },
//   body: [
//     {
//       name: '警報',
//       key: 'alarms',
//       type: 'bit_array',
//       addr: 0,
//       bitLength: 4
//     },
//     {
//       name: '最高單體',
//       key: 'max_voltage',
//       type: 'Int16BE',
//       unit: 'mV',
//       addr: 1
//     },
//     {
//       name: '最低單體',
//       key: 'min_voltage',
//       type: 'UInt16BE',
//       unit: 'mV',
//       addr: 2
//     },
//     {
//       name: '最高溫度',
//       key: 'max_temperature',
//       type: 'Int16BE',
//       unit: '0.1C',
//       addr: 3
//     },
//     {
//       name: '最大電流',
//       key: 'max_current',
//       type: 'Int16BE',
//       unit: 'A',
//       addr: 4
//     },
//     {
//       name: 'SOH',
//       key: 'SOH',
//       type: 'UInt16BE',
//       unit: '0.1%',
//       addr: 5
//     },
//     {
//       name: 'SOC',
//       key: 'SOC',
//       type: 'UInt16BE',
//       unit: '0.1%',
//       addr: 6
//     },
//     {
//       name: '異常電芯數量',
//       key: 'error_cells',
//       type: 'UInt8BE',
//       unit: '顆',
//       addr: 7,
//       byteLength: 1
//     },
//     {
//       name: '異常門檻值',
//       key: 'sv_thresh',
//       type: 'UInt16BE',
//       unit: '0.1',
//       addr: 8
//     },
//     {
//       name: '電芯值',
//       key: 'sv_cells',
//       type: 'Int16BE_array',
//       unit: '0.1',
//       addr: 9,
//       wordLength: 160
//     }
//   ]
// }

export const protocol: Protocol = {
  meta: {
    name: 'default',
    slaveIds: [1],
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    scanRate: 1000
  },
  body: [
    {
      meta: {
        startAddr: 0,
        quantity: 125
      },
      schema: [
        {
          name: '警報',
          key: 'alarms',
          type: 'bit_switches',
          addr: 0,
          bits: {
            '0': 'overVoltage',
            '1': 'underVoltage',
            '2': 'overTemperature',
            '3': 'commError'
          }
        },
        {
          name: '最高單體',
          key: 'maxVoltage',
          type: 'Int16BE',
          unit: 'mV',
          addr: 1
        },
        {
          name: '最低單體',
          key: 'minVoltage',
          type: 'UInt16BE',
          unit: 'mV',
          addr: 2
        },
        {
          name: '最高溫度',
          key: 'maxTemperature',
          type: 'Int16BE',
          unit: '0.1C',
          addr: 3
        },
        {
          name: '最大電流',
          key: 'maxCurrent',
          type: 'Int16BE',
          unit: 'A',
          addr: 4
        },
        {
          name: 'SOH',
          key: 'SOH',
          type: 'UInt16BE',
          unit: '0.1%',
          addr: 5
        },
        {
          name: 'SOC',
          key: 'SOC',
          type: 'UInt16BE',
          unit: '0.1%',
          addr: 6
        },
        {
          name: '門檻標準差',
          key: 'devThresh',
          type: 'UInt16BE',
          unit: '0.1 sigma',
          addr: 7,
          byteLength: 1
        },
        {
          name: '異常電芯數量',
          key: 'errorCells',
          type: 'UInt8BE',
          unit: '顆',
          addr: 8,
          byteLength: 1
        },
        {
          name: '異常門檻值',
          key: 'svThresh',
          type: 'UInt16BE',
          unit: '0.1',
          addr: 9
        },
        {
          name: '電芯',
          key: 'cellValues',
          type: 'array.UInt16BE',
          addr: 10,
          wordLength: 115
        }
      ]
    },
    {
      meta: {
        startAddr: 125,
        quantity: 45
      },
      schema: [
        {
          name: '電芯',
          key: 'cellValues',
          type: 'array.UInt16BE',
          addr: 0,
          wordLength: 45
        }
      ]
    }
  ]
}
