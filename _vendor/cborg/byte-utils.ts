export const slice =
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes: Uint8Array, start: number, end: number) => {
    return bytes.slice(start, end)
  }

export const concat =
  /* c8 ignore next 19 */
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks: Uint8Array[], length: number): Uint8Array => {
    const out = new Uint8Array(length)
    let off = 0
    for (let b of chunks) {
      if (off + b.length > out.length) {
        // final chunk that's bigger than we need
        b = b.subarray(0, out.length - off)
      }
      out.set(b, off)
      off += b.length
    }
    return out
  }

export const alloc =
  /* c8 ignore next 8 */
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size: number): Uint8Array => {
    return new Uint8Array(size)
  }
