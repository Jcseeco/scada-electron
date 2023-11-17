/**
 * generates a uuid with current datetime and 6 random base36 characters
 * @returns {string} unique if with length of 20 characters
 */
export const uniqueId = function () {
  return Date.now() + '-' + Math.random().toString(36).substring(2, 7)
}

export function flatten(obj: any): Array<any> {
  const result: Array<any> = []

  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Object) {
      result.concat(flatten(obj[key]))
    } else {
      result.push(obj)
    }
  })

  return result
}

/**
 * @param {number} delay - ms
 */
export function sleep(delay: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delay))
}

export function flatDeep(source: any, delimeter = ',') {
  let str = ''

  for (const [key, value] of Object.entries(source)) {
    // ignore private properties
    if (key.startsWith('_')) continue

    if (value instanceof Object) {
      str += flatDeep(value)
      continue
    }

    str += String(value) + delimeter
  }

  return str
}
