# v_core_cache

Simple Cache Solution for Node and Web.

Sections:

1. 📑 How to use
2. 🚗 Functions and Methods
3. 🎪 Events
4. ➰ Auto Cleanup Expired
5. ❌ Deleted / Removed

---

## 📑 How to use

```js
const { V_Core_Cache } = require('v_core_cache')
const cache = new V_Core_Cache()

// OR

const { createCache } = require('v_core_cache')
const cache = createCache()
```

## 🚗 Functions and Methods

### 1. Get Item Value

```js
await cache.get(key) //> anything you put in
cache.getSync(key)
```

### 2. Get Whole Cache

Returns all cache.

```js
cache.getAll() //> object
```

### 3. Size of Cache

Returns the approximate size of the cache in bytes.

```js
await cache.size() //> 1507114
cache.sizeSync()
```

### 4. Has Item?

Returns true if the key exists in the cache and is not expired.

```js
cache.has(key)
```

### 5. Set Item

Set/Create/Update an item in the cache. Will overwrite existing item.

```js
    await cache.set(key, data, expires?)
    cache.setSync(key, data, expires?)
```

### 6. Purge cache

Returns true if cache was successfully purged. Otherwise, returns false if cache is already empty.

```js
await cache.purge()
```

### 7. Delete item from cache

```js
await cache.del(key) //> true/false
cache.delSync(key)
```

### 8. Stats

Returns stats about the cache.

```js
cache.stats() //> { hits: 156, misses: 15, count: 33, size: 1507114 }
```

### 9. Purge Stats

This basically just resets counters for hits and misses.

```js
cache.purgeStats() //> { hits: 0, misses: 0, count: 33, size: 1507114 }
```

### 10. Get Item Expire Time

Returns the time in milliseconds when the item will expire.

```js
cache.getExpire(key) //> 150123456789 [ Date.now() + expires]
```

### 11. Cleanup Expired Items

Returns the number of expired items removed.

```js
await cache.cleanup()
```

### 12. Count Items

Returns the number of items in cache.

```js
await cache.count()
cache.countSync()
```

---

## 🎪 Events

## Management

### 1. Add Event Listener

```js
cache.addListener('set', (data) => console.log(data))
// or
cache.on('set', (data) => console.log(data))
```

### 2. Remove Event Listener

```js
cache.removeListener('set', (data) => console.log(data))
// or
cache.off('set', (data) => console.log(data))
```

### 3. Prepend Event Listener

```js
cache.prependListener('set', (data) => console.log(data))
// or
cache.pre('set', (data) => console.log(data))
```

### 4. Get Registered EventNames

```js
console.log(cache.eventNames())
```

### 5. Remove All Listeners

Removes all registered listeners for a single event

```js
cache.removeAllListeners('set')
```

### 6. Purge All Listeners

Removes all registered listeners for all registered events

```js
cache.purgeAllListeners()
```

## Available events

### 1. SET

Returns {key, value} pair.

```js
cache.on('set', (item) => console.log(item.key, item.value))
```

### 1.2 set with key

In this case we are returning the value only.

```js
cache.on('set/{key}', (value) => console.log(value))
```

### 2. GET

```js
cache.on('get', (item) => console.log(data)) //> { key, value } - value can be undefined
```

### 3. HIT

```js
cache.on('hit', (item) => console.log(item)) //> { key, value }
```

### 4. MISS

```js
cache.on('miss', (item) => console.log(item)) //> { key }
```

### 5. PURGE

```js
cache.on('purge', (status) => console.log(status)) //> true/false - can return false if already empty
```

### 6. PURGE_STATS

```js
cache.on('purge_stats', (data) => console.log(data)) //> { hits, misses, count, size } - returns stats after purging them.
```

### 6. cleanup

returns number of affected items

```js
cache.on('cleanup', (data) => console.log(data)) //> number
```

### 6. addListener

New listener added

```js
cache.on('addListener', (data) => console.log(data))
```

### 6. removeListener

Removed event listener

```js
cache.on('addListener', (data) => console.log(data))
```

---

## ➰ Auto Cleanup Expired

```js
const V_Core_Cache = require('v_core_cache')
const cache = new V_Core_Cache({ cleanInterval: 250 }) // Number in milliseconds
```

> **NOTE**: When using autoCleanup you should stop the cleanup interval by calling `cache.stopCleanup()`
