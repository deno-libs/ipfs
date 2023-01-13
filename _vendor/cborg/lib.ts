// deno-lint-ignore-file no-explicit-any
class Type {
  static uint: Type
  major: number
  majorEncoded: number
  name: string
  terminal: boolean
  static negint: Type
  static bytes: Type
  static string: Type
  static array: Type
  static map: Type
  static tag: Type
  static float: Type
  static false: Type
  static true: Type
  static null: Type
  static undefined: Type
  static break: Type

  constructor(major: number, name: string, terminal: boolean) {
    this.major = major
    this.majorEncoded = major << 5
    this.name = name
    this.terminal = terminal
  }
  toString() {
    return `Type[${this.major}].${this.name}`
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ: Type): number {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0
  }
}
// convert to static fields when better supported
Type.uint = new Type(0, 'uint', true)
Type.negint = new Type(1, 'negint', true)
Type.bytes = new Type(2, 'bytes', true)
Type.string = new Type(3, 'string', true)
Type.array = new Type(4, 'array', false)
Type.map = new Type(5, 'map', false)
Type.tag = new Type(6, 'tag', false) // terminal?
Type.float = new Type(7, 'float', true)
Type.false = new Type(7, 'false', true)
Type.true = new Type(7, 'true', true)
Type.null = new Type(7, 'null', true)
Type.undefined = new Type(7, 'undefined', true)
Type.break = new Type(7, 'break', true)

class Token {
  type: Type
  value: any
  encodedLength: number
  encodedBytes: Uint8Array | undefined
  byteValue: Uint8Array | undefined

  constructor(type: Type, value: any, encodedLength: number) {
    this.type = type
    this.value = value
    this.encodedLength = encodedLength
    this.encodedBytes = undefined
    this.byteValue = undefined
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`
  }
}
export { Type, Token }
