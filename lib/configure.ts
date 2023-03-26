import { Client } from './core.ts'
import type { Options } from '../types.d.ts'

type Fn<T> = (client: Client, clientOptions: Options) => T

type Factory<T> = (clientOptions: Options) => T

export const configure = <T>(fn: Fn<T>): Factory<T> => {
  return (options) => {
    return fn(new Client(options), options)
  }
}
