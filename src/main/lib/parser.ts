export const parseBitArray = function (num: number, bits = 8): Array<number> {
  const bitArray: Array<number> = []
  while (bits--) {
    bitArray.push(num % 2)
    num = Math.floor(num / 2)
  }
  return bitArray
}

export const unsignedToSigned = function (uint: number, bits: number): number {
  const maxUnsigned = Math.pow(2, bits)
  if (uint < maxUnsigned / 2) {
    return uint
  } else {
    return uint - maxUnsigned
  }
}

export const maskNumber = function (num: number, bits: number) {
  const mask = (1 << bits) - 1

  return num & mask
}
