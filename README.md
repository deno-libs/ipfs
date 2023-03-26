# ipfs (W.I.P.)

Deno port of the [ipfs-http-client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client) IPFS client.

It re-uses as much of original code as possible, while minimizing amount of dependencies and using TypeScript instead of JSDoc for better types.

esm.sh version of ipfs-http-client has 390 dependencies, our plan is to cut it down to about 100-200 and improve types in some places.