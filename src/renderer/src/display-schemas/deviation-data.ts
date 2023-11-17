type SchemaProps = {
  [x: string | number | symbol]: SchemaDetail
}

type SchemaDetail = {
  label?: string
  value: unknown
  [x: string | number | symbol]: unknown
}

export class DeviationDataSchema {
  static alarms: SchemaProps = {
    overVoltage: {
      label: '過電壓異常',
      value: false
    },
    underVoltage: {
      label: '低電壓異常',
      value: false
    },
    commError: {
      label: '通訊異常',
      value: false
    },
    overTemperature: {
      label: '過溫異常',
      value: false
    }
  }
  static generals: SchemaProps = {
    maxVoltage: {
      label: '最高電壓值',
      value: 0
    },
    minVoltage: {
      label: '最低電壓值',
      value: 0
    },
    maxTemperature: {
      label: '最高溫度值',
      value: 0
    },
    maxCurrent: {
      label: '最大電流值',
      value: 0
    },
    SOH: {
      label: 'SOH',
      value: 0
    },
    SOC: {
      label: 'SOC',
      value: 0
    }
  }
  static graphs: {
    cellValues: {
      label: '離群指標值'
      infos: {}
    }
  }
  static timestamp: Date = new Date()
}
