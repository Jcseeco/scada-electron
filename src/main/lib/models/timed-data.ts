import { flatDeep } from '../utils'
import { Model } from './model'

export enum BMSState {
  IDLE = 'idle',
  CHARGING = 'charging',
  DISCHARGING = 'discharging',
  ERROR = 'error'
}

export class TimedData extends Model {
  _timestamp: Date
  _state: BMSState = BMSState.IDLE
  alarms: object = {}
  maxVoltage = 0
  minVoltage = 0
  maxTemperature = 0
  maxCurrent = 0
  SOH = 0
  SOC = 0
  // deviation threshold unit 0.1
  devThresh = 60

  errorCells = 0
  svThresh = 0
  cellValues: number[] = []

  constructor(slaveId: number) {
    super(slaveId)

    this._timestamp = new Date()
  }

  flattenToString(delimeter = ',') {
    let str = ''

    str +=
      this._timestamp.toLocaleString('zh-tw', { timeZone: process.env.TZ, hour12: false }) +
      delimeter

    str += flatDeep(this, delimeter).slice(0, -1)

    return str
  }

  afterPropsSet(): void {
    // check charging status
    if (this.maxCurrent > 5) {
      this._state = BMSState.CHARGING
    } else if (this.maxCurrent < -50) {
      this._state = BMSState.DISCHARGING
    } else {
      this._state = BMSState.IDLE
    }
  }
}
