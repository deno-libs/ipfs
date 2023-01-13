import { BlockEncoder, BlockDecoder, Phantom, MultihashDigest, ByteView, MultibaseEncoder, Multibase } from './types.ts'

/**
 * An IPLD codec is a combination of both encoder and decoder.
 */
export interface BlockCodec<Code extends number, T> extends BlockEncoder<Code, T>, BlockDecoder<Code, T> {}

export type Version = 0 | 1

export type DAG_PB = 0x70
export type SHA_256 = 0x12

/**
 * Represents an IPLD link to a specific data of type `T`.
 *
 * @template T - Logical type of the data being linked to.
 * @template C - multicodec code corresponding to a codec linked data is encoded with
 * @template A - multicodec code corresponding to the hashing algorithm of the CID
 * @template V - CID version
 */
export interface Link<
  Data extends unknown = unknown,
  Format extends number = number,
  Alg extends number = number,
  V extends Version = 1
> extends Phantom<Data> {
  readonly version: V
  readonly code: Format
  readonly multihash: MultihashDigest<Alg>

  readonly byteOffset: number
  readonly byteLength: number
  readonly bytes: ByteView<Link<Data, Format, Alg, V>>

  equals: (other: unknown) => other is Link<Data, Format, Alg, Version>

  toString: <Prefix extends string>(
    base?: MultibaseEncoder<Prefix>
  ) => ToString<Link<Data, Format, Alg, Version>, Prefix>
  link: () => Link<Data, Format, Alg, V>

  toV1: () => Link<Data, Format, Alg, 1>
}

export interface LinkJSON<T extends UnknownLink = UnknownLink> {
  '/': ToString<T>
}

export interface LegacyLink<T extends unknown = unknown> extends Link<T, DAG_PB, SHA_256, 0> {}

export type UnknownLink = LegacyLink<unknown> | Link<unknown, number, number, Version>

export type ToString<T, Prefix extends string = string> = Multibase<Prefix> & Phantom<T>
