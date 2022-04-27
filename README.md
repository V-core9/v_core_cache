# v_core_cache

Simple Cache Solution for Node and Web.

## 📑 How to use

### 0. Start by

    const V_Core_Cache = require('v_core_cache');
    const cache = new V_Core_Cache();

### 1. Get Item Value

    cache.get(key)  //> anything you put in

### 2. Get Whole Cache

    cache.getAll(key) //> object - all cache

### 3. Return Number of items

    cache.size()  //> 1507114 - approximate in bytes

### 4. Check if exists

    cache.has(key)   //> true/false

### 5. Create or update an entry

    cache.set(key, data, expires)  //> true/false

### 6. Purge cache

    cache.purge()   //> true/false

### 7. Delete item from cache

    cache.del(key)  //> true/false

### 8. Stats

Returns stats about the cache.

    cache.stats() //> {hits: 56, misses: 5, count: 3, size: 1507114}

### 9. Purge Stats

This basically just resets counters for hits and misses.

    cache.purgeStats()  //> {hits: 0, misses: 0, count: 3, size: 1507114}

### 10. Get Item Expire Time

Returns the time in milliseconds when the item will expire.

    cache.getExpire(key); //> 150123456789 [ Date.now() + expires]

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

## ❌ Deleted / Removed  

### 6. Save cache to a file **[Removed]**

    cache.toFile(filePath)

### 7. Load cache from a file **[Removed]**

    cache.fromFile(filePath)

> By removing v_file_system it can be used in web applications and **webpack** out of the box.
