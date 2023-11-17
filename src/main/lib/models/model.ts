import { uniqueId } from '../utils'

export abstract class Model {
  protected _flushed = false
  protected _id: string
  slaveId: number

  constructor(slaveId: number) {
    this.slaveId = slaveId

    this._id = uniqueId()
  }

  setProps(props: object) {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        this.setProp(key, props[key])
      }
    }

    this.afterPropsSet()
  }

  afterPropsSet() {}

  setProp(key: string, value: any) {
    if (!this.hasOwnProperty(key)) return

    if (value.constructor !== this[key].constructor) return

    if (this[key] instanceof Array) {
      this.appendArray(key, value)
      return
    }

    if (this[key] instanceof Object) {
      this.setDict(key, value)
      return
    }

    this[key] = value
  }

  appendArray(key: string, value: Array<any>) {
    this[key] = this[key].concat(value)
  }

  setDict(key: string, value: object) {
    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        this[key][prop] = value[prop]
      }
    }
  }
  flush() {
    this._flushed = true
  }

  isFlushed() {
    return this._flushed
  }
}
