import { create } from './mod.ts'

const client = create()

const { cid } = await client.add('Hello World!')

console.log(cid)
