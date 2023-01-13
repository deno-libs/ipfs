import type { Multiaddr } from 'https://esm.sh/@multiformats/multiaddr@11.1.5'
import { BlockCodec, MultibaseCodec, MultihashHasher } from './_vendor/multiaddr.ts'

export interface IPLDOptions {
  loadBase: LoadBaseFn
  loadCodec: LoadCodecFn
  loadHasher: LoadHasherFn
  bases: Array<MultibaseCodec<any>>
  codecs: Array<BlockCodec<any, any>>
  hashers: MultihashHasher[]
}

export interface LoadBaseFn {
  (codeOrName: number | string): Promise<MultibaseCodec<any>>
}
export interface LoadCodecFn {
  (codeOrName: number | string): Promise<BlockCodec<any, any>>
}
export interface LoadHasherFn {
  (codeOrName: number | string): Promise<MultihashHasher>
}

export interface Options {
  host?: string
  port?: number
  protocol?: string
  headers?: Headers | Record<string, string>
  timeout?: number | string
  apiPath?: string
  url?: URL | string | Multiaddr
  ipld?: Partial<IPLDOptions>
}
