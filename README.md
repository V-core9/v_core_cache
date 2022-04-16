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
