// @deno-types="https://esm.sh/ipfs-http-client@60.0.0/dist/src/lib/mode-to-string.d.ts"
import { modeToString } from 'https://esm.sh/ipfs-http-client@60.0.0/src/lib/mode-to-string.js'
import { parseMtime } from 'https://esm.sh/ipfs-http-client@60.0.0/src/lib/parse-mtime.js'

export function toUrlSearchParams(
  { arg, searchParams, hashAlg,  ...options }: Partial<
    { arg: any; searchParams: unknown; hashAlg: string; mtime: any; mode: string; hash: string; mtimeNsecs: number; timeout: number | string; }
  > = {},
) {
  if (searchParams) {
    options = {
      ...options,
      ...searchParams,
    }
  }

  if (hashAlg) {
    options.hash = hashAlg
  }

  if (options.mtime != null) {
    const mtime = parseMtime(options.mtime)!

    options.mtime = mtime.secs
    options.mtimeNsecs = mtime.nsecs
  }

  if (options.mode != null) {
    options.mode = modeToString(options.mode)
  }

  if (options.timeout && !isNaN(options.timeout as number)) {
    // server API expects timeouts as strings
    options.timeout = `${options.timeout}ms`
  }

  if (arg === undefined || arg === null) {
    arg = []
  } else if (!Array.isArray(arg)) {
    arg = [arg]
  }

  const urlSearchParams = new URLSearchParams(options as Record<string, string>)

  arg.forEach((arg: string) => urlSearchParams.append('arg', arg))

  return urlSearchParams
}
