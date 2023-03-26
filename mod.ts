import {
  bases,
  codecs,
  dagCBOR,
  dagJOSE,
  dagJSON,
  dagPB,
  globSourceImport,
  hashes,
  identity,
  Multibases,
  Multicodecs,
  Multihashes,
} from './deps.ts'
import type { BlockCodec, MultibaseCodec, MultihashHasher } from './deps.ts'
import type { Options, IPFSHTTPClient } from "./types.d.ts";

export function create(options: Options = {}) {
  // deno-lint-ignore no-explicit-any
  const id: BlockCodec<any, any> = {
    name: identity.name,
    code: identity.code,
    encode: (id) => id,
    decode: (id) => id,
  }

  const multibaseCodecs: MultibaseCodec<string>[] = Object.values(bases)
  ;(options.ipld && options.ipld.bases ? options.ipld.bases : []).forEach((base) => multibaseCodecs.push(base))

  const multibases = new Multibases({
    bases: multibaseCodecs,
    loadBase: options.ipld && options.ipld.loadBase,
  })

  // deno-lint-ignore no-explicit-any
  const blockCodecs: BlockCodec<any, any>[] = Object.values(codecs)
  ;[dagPB, dagCBOR, dagJSON, dagJOSE, id].concat((options.ipld && options.ipld.codecs) || []).forEach((codec) =>
    blockCodecs.push(codec)
  )

  const multicodecs = new Multicodecs({
    codecs: blockCodecs,
    loadCodec: options.ipld && options.ipld.loadCodec,
  })

  const multihashHashers: MultihashHasher[] = Object.values(hashes)
  ;(options.ipld && options.ipld.hashers ? options.ipld.hashers : []).forEach((hasher) => multihashHashers.push(hasher))

  const multihashes = new Multihashes({
    hashers: multihashHashers,
    loadHasher: options.ipld && options.ipld.loadHasher,
  })

  const client: IPFSHTTPClient = {
    // add: createAdd(options),
    // addAll: createAddAll(options),
    // bitswap: createBitswap(options),
    // block: createBlock(options),
    // bootstrap: createBootstrap(options),
    // cat: createCat(options),
    // commands: createCommands(options),
    // config: createConfig(options),
    // dag: createDag(multicodecs, options),
    // dht: createDht(options),
    // diag: createDiag(options),
    // dns: createDns(options),
    // files: createFiles(options),
    // get: createGet(options),
    // getEndpointConfig: createGetEndpointConfig(options),
    // id: createId(options),
    // isOnline: createIsOnline(options),
    // key: createKey(options),
    // log: createLog(options),
    // ls: createLs(options),
    // mount: createMount(options),
    // name: createName(options),
    // object: createObject(multicodecs, options),
    // pin: createPin(options),
    // ping: createPing(options),
    // pubsub: createPubsub(options),
    // refs: createRefs(options),
    // repo: createRepo(options),
    // resolve: createResolve(options),
    // start: createStart(options),
    // stats: createStats(options),
    // stop: createStop(options),
    // swarm: createSwarm(options),
    // version: createVersion(options),
    bases: multibases,
    codecs: multicodecs,
    hashers: multihashes,
  }

  return client
}

export const globSource = globSourceImport
