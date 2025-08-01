## `isServer` / `isClient`

Environment detection utilities to determine if code is running on server or client side.

### Usage

```ts
import { isServer, isClient } from 'zedom'

if (isServer) {
  // Server-side code
  console.log('Running on server')
}

if (isClient) {
  // Client-side code
  console.log('Running in browser')
  document.getElementById('app')
}
```

### Properties

1. `isServer` *(boolean)*: `true` if running on server (no window object), `false` otherwise
2. `isClient` *(boolean)*: `true` if running in browser (window object exists), `false` otherwise

### Returns

*(boolean)*: Boolean values indicating the current environment