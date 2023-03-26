import { isMultiaddr } from '../deps.ts'
import parseDuration from 'https://esm.sh/parse-duration@1.0.3'
import { logger } from 'https://esm.sh/@libp2p/logger@2.0.6'
import HTTP from 'https://esm.sh/ipfs-utils@9.0.14/src/http.js'
import mergeOpts from 'https://esm.sh/merge-options@3.0.4'
import { toUrlString } from 'https://esm.sh/ipfs-core-utils@0.18.0/to-url-string'
import type { Multiaddr, Options } from '../deps.ts'
import type { HTTPOptions } from '../_vendor/ipfs-utils.types.d.ts'

const log = logger('ipfs-http-client:lib:error-handler')
const merge = mergeOpts.bind({ ignoreUndefined: true })

const DEFAULT_PROTOCOL = location.protocol
const DEFAULT_HOST = location.hostname
const DEFAULT_PORT = location.port

const normalizeOptions = (options: Options | URL | Multiaddr | string = {}): Options => {
  let url
  let opts: Options = {}

  if (typeof options === 'string' || isMultiaddr(options)) {
    url = new URL(toUrlString(options))
  } else if (options instanceof URL) {
    url = options
  } else if (typeof options.url === 'string' || isMultiaddr(options.url)) {
    url = new URL(toUrlString(options.url))
    opts = options
  } else if (options.url instanceof URL) {
    url = options.url
    opts = options
  } else {
    opts = options || {}

    const protocol = (opts.protocol || DEFAULT_PROTOCOL).replace(':', '')
    const host = (opts.host || DEFAULT_HOST).split(':')[0]
    const port = opts.port || DEFAULT_PORT

    url = new URL(`${protocol}://${host}:${port}`)
  }

  if (opts.apiPath) {
    url.pathname = opts.apiPath
  } else if (url.pathname === '/' || url.pathname === undefined) {
    url.pathname = 'api/v0'
  }

  return {
    ...opts,
    host: url.host,
    protocol: url.protocol.replace(':', ''),
    port: Number(url.port),
    apiPath: url.pathname,
    url,
  }
}

export const errorHandler = async (response: Response) => {
  let msg

  try {
    if ((response.headers.get('Content-Type') || '').startsWith('application/json')) {
      const data = await response.json()
      log(data)
      msg = data.Message || data.message
    } else {
      msg = await response.text()
    }
  } catch (/** @type {any} */ err) {
    log('Failed to parse error response', err)
    // Failed to extract/parse error message from response
    msg = err.message
  }

  let error = new HTTP.HTTPError(response)

  if (msg) {
    // This is what rs-ipfs returns where there's a timeout
    if (msg.includes('deadline has elapsed')) {
      error = new HTTP.TimeoutError()
    }

    // This is what go-ipfs returns where there's a timeout
    if (msg && msg.includes('context deadline exceeded')) {
      error = new HTTP.TimeoutError()
    }
  }

  // This also gets returned
  if (msg && msg.includes('request timed out')) {
    error = new HTTP.TimeoutError()
  }

  // If we managed to extract a message from the response, use it
  if (msg) {
    error.message = msg
  }

  throw error
}

const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

const kebabCase = (str: string) => {
  return str.replace(KEBAB_REGEX, function (match) {
    return '-' + match.toLowerCase()
  })
}

const parseTimeout = (value: string | number) => {
  return typeof value === 'string' ? parseDuration(value) : value
}

export class Client extends HTTP {
  constructor(options: Options | URL | Multiaddr | string = {}) {
    const opts = normalizeOptions(options)

    super({
      timeout: parseTimeout(opts.timeout || 0) || undefined,
      headers: opts.headers,
      base: `${opts.url}`,
      handleError: errorHandler,
      transformSearchParams: (search: [string, string | number][]) => {
        const out = new URLSearchParams()

        for (const [key, value] of search) {
          if (
            value !== 'undefined' &&
            value !== 'null' &&
            key !== 'signal'
          ) {
            out.append(kebabCase(key), value as string)
          }
          if (key === 'timeout' && !isNaN(value as number)) {
            out.append(kebabCase(key), value as string)
          }
        }

        return out
      },
    })

    delete this.get
    delete this.put
    delete this.delete
    delete this.options

    this.fetch = (resource: string | Request, options: HTTPOptions = {}) => {
      if (typeof resource === 'string' && !resource.startsWith('/')) {
        resource = `${opts.url}/${resource}`
      }

      return fetch.call(
        this,
        resource,
        merge(options, {
          method: 'POST',
        }),
      )
    }
  }
}

export const HTTPError = HTTP.HTTPError
