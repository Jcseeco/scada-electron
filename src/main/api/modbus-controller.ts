import ModbusRTU from 'modbus-serial'
import { protocol } from '../lib/protocol'
import type { Protocol } from '../lib/protocol'
import { ipcMain } from 'electron'
import { uniqueId } from '../lib/utils'
import { BMSState, TimedData } from '../lib/models/timed-data'
import { transform } from '../lib/transformer'
import { sendWebContents } from '..'
// import { ReadRegisterResult } from 'modbus-serial/ModbusRTU'
// import { stringify } from 'csv-stringify/.'
import { appendFile } from 'fs'
import { logger } from '../lib/logger/logger'
import { sendEmail } from '../lib/email/mailer'

import { get as getSettings } from './system-settings-controller'

const managers: Map<string, ConnectionManager> = new Map()

interface ConnectionResponse {
  success: boolean
  uid?: string
  msg?: string
}

export async function connect(portPath: string): Promise<ConnectionResponse> {
  const client = new ModbusRTU()

  await client.connectRTUBuffered(portPath, {
    // baudRate: +(process.env.BAUD_RATE ?? 9600)
    baudRate: protocol.meta.baudRate ?? 1,
    dataBits: protocol.meta.dataBits ?? 8,
    parity: protocol.meta.parity ?? 'none',
    stopBits: protocol.meta.stopBits ?? 1
  })

  if (client.isOpen) {
    const uid = uniqueId()
    managers.set(uid, new ConnectionManager(uid, client, protocol))
    return { success: true, uid }
  } else {
    return { success: false }
  }

  // TODO remove below code as this is a mockup to test the renderer
  // let uid = uniqueId()
  // managers.set(uid, new ConnectionManager(uid, new ModbusRTU(), protocol))
  // return { success: true, uid }
}

export function disconnectAll(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const promises: Array<Promise<unknown>> = []

    managers.forEach((manager) => promises.push(manager.disconnect()))
    await Promise.all(promises)

    managers.clear()
    resolve()
  })
}

export function disconnect(uid: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const manager: ConnectionManager | undefined = managers.get(uid)

    const done: boolean = (await manager?.disconnect()) ?? false
    resolve(done)
  })
}

export function startPolling(uid: string) {
  managers.get(uid)?.pollStart()
}

export function stopPolling(uid: string) {
  managers.get(uid)?.pollStop()
}

export type ClientManager = ConnectionManager

export type DataUpdateBody = {
  managerId: string
  slaveId: number
  data: TimedData
}

class ConnectionManager {
  private _client: ModbusRTU
  protocol: Protocol
  private _uid: string
  target = 'file'
  filename: string

  // holds the latest data of each slave
  private _keep: Map<number, TimedData> = new Map()
  private _slaveStates: Map<number, BMSState> = new Map()

  private _taskInsterval: number | undefined

  constructor(uid: string, client: ModbusRTU, protocol: Protocol) {
    client.on('close', () => {
      client.destroy(() => {
        console.log('client connection closed with error')

        ipcMain.emit('serial:closed', 'client connection closed with error')
      })
    })

    this._uid = uid
    this._client = client
    this.protocol = protocol
    this.filename = `data/${new Date().toLocaleDateString('zh-tw').replaceAll('/', '-')}.csv`
  }

  pollStart() {
    // ensure only one interval is running
    this.pollStop()

    // bind readAll to this context because using it as closure
    const task: Function = this.readAll.bind(this)

    // start polling
    this._taskInsterval = setInterval(task, this.protocol.meta.scanRate)
  }

  pollStop() {
    if (!this._taskInsterval) return

    clearInterval(this._taskInsterval)
    this._taskInsterval = undefined
  }

  async readAll() {
    // console.log('reading all...')
    for (const slaveId of this.protocol.meta.slaveIds) {
      await this.readSlave(slaveId)
    }
  }

  // TODO remove this mockup code for testing
  // mockResult(start: number, length: number) {
  //   let data = [
  //     2, 3298, 3289, 356, 0, 1000, 533, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  //   ]
  //   return new Promise<Array<number>>((resolve) => {
  //     resolve(data.slice(start, start + length))
  //   })
  // }

  /**
   * emits event that will tell the renderer to update data retreived of this connection and slave
   * @param slaveId
   */
  async readSlave(slaveId: number) {
    this._client.setID(slaveId)

    // let promises: Array<Promise<void>> = []

    for (const group of this.protocol.body) {
      // TODO for testing
      // let result = await this.mockResult(group.meta.startAddr, group.meta.quantity)

      // let transformed = transform(result, group.schema)
      // this.keepSlaveData(slaveId, transformed)

      const readResult = await this._client.readHoldingRegisters(
        group.meta.startAddr,
        group.meta.quantity
      )
      this.keepSlaveData(slaveId, transform(readResult.data, group.schema))
    }

    // await Promise.all(promises)

    const slaveModel: TimedData = this._keep.get(slaveId) as TimedData

    appendFile(this.filename, slaveModel.flattenToString() + '\n', { encoding: 'utf-8' }, (err) => {
      if (err) logger.error(err)
    })

    // update renderer with data
    sendWebContents('mainWindow', 'data:update', {
      managerId: this._uid,
      slaveId,
      data: slaveModel
    } as DataUpdateBody)

    // flush data
    this._keep.delete(slaveId)

    // send email notification if state changed
    const prevState = this.updateSlaveState(slaveId, slaveModel._state)
    if (getSettings('sendEmail') && prevState !== undefined && prevState !== slaveModel._state) {
      sendEmail({
        subject: `BMS Monitor state has changed to ${slaveModel._state}`,
        text: `Here is the data:\n ${JSON.stringify(slaveModel)}`
      })
    }
  }

  /**
   * updates the state of a slave
   * @param slaveId
   * @param state
   * @returns previous state of slave
   */
  updateSlaveState(slaveId: number, state: BMSState): BMSState | undefined {
    const prev = this._slaveStates.get(slaveId)

    this._slaveStates.set(slaveId, state)

    return prev
  }

  /**
   * keep the latest data model of slave or update it's data
   * @param slaveId
   * @param data
   */
  keepSlaveData(slaveId: number, data: object) {
    if (!this._keep.has(slaveId)) {
      this._keep.set(slaveId, new TimedData(slaveId))
    }

    const timedData = this._keep.get(slaveId) as TimedData
    timedData.setProps(data)

    console.log(timedData.cellValues.length)
  }

  getUid() {
    return this._uid
  }

  setOutputTarget(target: string) {
    if (!['file', 'db'].includes(target)) return
    this.target = target
  }

  disconnect(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.pollStop()

      this._client.close(() => resolve(true))
    })
  }
}
