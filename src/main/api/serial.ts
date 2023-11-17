import { SerialPort } from 'serialport'

export const listPorts: any = () => {
  return SerialPort.list()
}
