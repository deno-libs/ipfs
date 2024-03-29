import type { CID } from "https://esm.sh/multiformats@11.0.2/cid"
import type { PeerId } from "https://esm.sh/@libp2p/interface-peer-id@2.0.1"
import type { AbortOptions } from "../types.d.ts";


export interface API<OptionExtension = {}> {
  /**
   * Returns the wantlist for your node
   *
   * @example
   * ```js
   * const list = await ipfs.bitswap.wantlist()
   * console.log(list)
   * // [ CID('QmHash') ]
   * ```
   */
  wantlist: (options?: AbortOptions & OptionExtension) => Promise<CID[]>
  /**
   * Returns the wantlist for a connected peer
   *
   * @example
   * ```js
   * const list = await ipfs.bitswap.wantlistForPeer(peerId)
   * console.log(list)
   * // [ CID('QmHash') ]
   * ```
   */
  wantlistForPeer: (peerId: PeerId, options?: AbortOptions & OptionExtension) => Promise<CID[]>
  /**
   * Removes one or more CIDs from the wantlist
   *
   * @example
   * ```JavaScript
   * let list = await ipfs.bitswap.wantlist()
   * console.log(list)
   * // [ CID('QmHash') ]
   *
   * await ipfs.bitswap.unwant(cid)
   *
   * list = await ipfs.bitswap.wantlist()
   * console.log(list)
   * // []
   * ```
   */
  unwant: (cids: CID | CID[], options?: AbortOptions & OptionExtension) => Promise<void>
  /**
   * Show diagnostic information on the bitswap agent.
   * Note: `bitswap.stat` and `stats.bitswap` can be used interchangeably.
   *
   * @example
   * ```js
   * const stats = await ipfs.bitswap.stat()
   * console.log(stats)
   * ```
   */
  stat: (options?: AbortOptions & OptionExtension) => Promise<Stats>
}
export interface Stats {
  provideBufLen: number
  wantlist: CID[]
  peers: PeerId[]
  blocksReceived: bigint
  dataReceived: bigint
  blocksSent: bigint
  dataSent: bigint
  dupBlksReceived: bigint
  dupDataReceived: bigint
}