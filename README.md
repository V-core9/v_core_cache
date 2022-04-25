# v_core_cache

Simple Cache Solution for Node and Web.

## 📑 How to use

### 0. Start by

    const V_Core_Cache = require('v_core_cache');
    const $ = new V_Core_Cache();

### 1. Get Item Value

    $.get(key)

### 2. Get Whole Cache

    $.getAll(key)

### 3. Return Number of items

    $.size()

### 4. Check if exists

    $.has(key)

### 5. Create or update an entry

    $.set(key, data, expires)

### 6. Delete cache

    $.purge()

### 7. Delete item from cache

    $.del(key)

### 8. Stats

    $.stats()

### 9. SET Event

    $.on('set', (data) => console.log(data))

### 10. GET Event

    $.on('get', (data) => console.log(data))

### 11. HIT Event

    $.on('hit', (data) => console.log(data))

### 12. MISS Event

    $.on('miss', (data) => console.log(data))

### 13. PURGE Event

    $.on('purge', (data) => console.log(data))

## ❌ Deleted / Removed  

### 6. Save cache to a file **[Removed]**

    $.toFile(filePath)

### 7. Load cache from a file **[Removed]**

    $.fromFile(filePath)

> By removing v_file_system it can be used in web applications and **webpack** out of the box.
