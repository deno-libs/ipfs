import { CID } from "https://esm.sh/multiformats@11.0.2/cid"
import { configure } from '../lib/configure.ts'
import { toUrlSearchParams } from '../lib/to-url-search-params.ts'
import { peerIdFromString } from "https://esm.sh/@libp2p/peer-id@2.0.3"
import type { API as BitswapAPI } from "../_vendor/ipfs-core-types.bitswap.d.ts"
import type { HTTPClientExtraOptions } from "../types.d.ts";



export const createStat = configure(api => {
  const stat: BitswapAPI<HTTPClientExtraOptions>['stat'] = async (options = {}) => {
    const res = await api.post('bitswap/stat', {
      searchParams: toUrlSearchParams(options),
      signal: options.signal,
      headers: options.headers
    })

    return toCoreInterface(await res.json())
  }
  return stat
})

function toCoreInterface (res: any) {
  return {
    provideBufLen: res.ProvideBufLen,
    wantlist: (res.Wantlist || []).map((k: { '/': string }) => CID.parse(k['/'])),
    peers: (res.Peers || []).map((str: string) => peerIdFromString(str)),
    blocksReceived: BigInt(res.BlocksReceived),
    dataReceived: BigInt(res.DataReceived),
    blocksSent: BigInt(res.BlocksSent),
    dataSent: BigInt(res.DataSent),
    dupBlksReceived: BigInt(res.DupBlksReceived),
    dupDataReceived: BigInt(res.DupDataReceived)
  }
}
