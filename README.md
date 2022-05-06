# v_core_cache

Simple Cache Solution for Node and Web.

Sections:

1. 📑 How to use
2. 🚗 Functions and Methods
3. 🎪 Events
4. ➰ Auto Cleanup Expired
5. ❌ Deleted / Removed

___

## 📑 How to use

    const V_Core_Cache = require('v_core_cache');
    const cache = new V_Core_Cache();

## 🚗 Functions and Methods

### 1. Get Item Value

    cache.get(key)  //> anything you put in

### 2. Get Whole Cache

Returns all cache.

    cache.getAll() //> object

### 3. Size of Cache

Returns the approximate size of the cache in bytes.

    cache.size()  //> 1507114 

### 4. Has Item?

Returns true if the key exists in the cache and is not expired.

    cache.has(key)   

### 5. Set Item

Set/Create/Update an item in the cache. Will overwrite existing item.

    cache.set(key, data, expires)  

### 6. Purge cache

Returns true if cache was successfully purged. Otherwise, returns false if cache is already empty.

    cache.purge()

### 7. Delete item from cache

    cache.del(key)  //> true/false

### 8. Stats

Returns stats about the cache.

    cache.stats() //> { hits: 156, misses: 15, count: 33, size: 1507114 }

### 9. Purge Stats

This basically just resets counters for hits and misses.

    cache.purgeStats()  //> { hits: 0, misses: 0, count: 33, size: 1507114 }

### 10. Get Item Expire Time

Returns the time in milliseconds when the item will expire.

    cache.getExpire(key); //> 150123456789 [ Date.now() + expires]

### 11. Cleanup Expired Items

Returns the number of expired items removed.

    cache.cleanup(); 

### 12. Count Items

Returns the number of items in cache.

    cache.count(); 

___

## 🎪 Events

### 1. SET

    cache.on('set', (item) => console.log(item.key, item.value))

### 2. GET

    cache.on('get', (item) => console.log(data)) //> { key, value } - value can be undefined 

### 3. HIT

    cache.on('hit', (item) => console.log(item)) //> { key, value } 

### 4. MISS

    cache.on('miss', (item) => console.log(item)) //> { key } 

### 5. PURGE

    cache.on('purge', (status) => console.log(status)) //> true/false - can return false if already empty

### 6. PURGE_STATS

    cache.on('purge_stats', (data) => console.log(data)) //> { hits, misses, count, size } - returns stats after purging them.

___

## ➰ Auto Cleanup Expired

    const V_Core_Cache = require('v_core_cache');
    const cache = new V_Core_Cache({ cleanInterval: 250 }); // Number in milliseconds 

> **NOTE**: When using autoCleanup you should stop the cleanup interval by calling `cache.stopCleanup()`

___

## ❌ Deleted / Removed  

### 6. Save cache to a file **[Removed]**

    cache.toFile(filePath)

### 7. Load cache from a file **[Removed]**

    cache.fromFile(filePath)

> By removing v_file_system it can be used in web applications and **webpack** out of the box.
