# v_core_cache

### 0. Start by...

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

### 6. Save cache to a file

    $.toFile(filePath)

### 7. Load cache from a file

    $.fromFile(filePath)

### 8. Delete cache

    $.purge()

### 9. Delete item from cache

    $.del(key)

### 10. Stats

    $.stats()

### 11. SET Event

    $.on('set', (data) => console.log(data))
### 12. GET Event

    $.on('get', (data) => console.log(data))

### 13. HIT Event

    $.on('hit', (data) => console.log(data))

### 14. MISS Event

    $.on('miss', (data) => console.log(data))

### 15. PURGE Event

    $.on('purge', (data) => console.log(data))

    
