import { identity, base32, base64, sha2, raw, json, CID } from '../../deps.ts'

export const hashes = { ...sha2, ...identity }

export const bases = { ...base32, ...base64 }

export const codecs = { raw, json }

export { CID }
