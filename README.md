These examples are based on actual code used at PlanGrid.

`db.js` and `cache.js` are simplified + mocked versions of database and caching layers.

Setup:

```
> nvm install 4.2.0
> nvm use 4.2.0
> npm install
> babel-node --experimental test-async-await.js
```

Each `test-xyz.js` should have the following output:

```
Getting 'real-token'
## cache-get: undefined
## db-get: {"user":"kenrick","id":"real-id"}
## cache-set: {"user":"kenrick","id":"real-id"}
# got id: real-id

Getting 'real-token'
## cache-get: {"user":"kenrick","id":"real-id"}
# got id: real-id

Getting 'fake-token'
## cache-get: undefined
## db-get: undefined
## cache-set: {}
# error: Error: 401: Authentication token is incorrect.

Getting 'fake-token'
## cache-get: {}
# error: Error: 401: Authentication token is incorrect.
```
