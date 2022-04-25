const V_Core_Cache = require('../..');
const testCache = new V_Core_Cache();

test("Bunch of items adding/size check/clear", async () => {

  expect(await testCache.size()).toBe(0);

  let startTS = Date.now();
  const itemsCount = 1000000;
  for (let i = 0; i < itemsCount; i++) {
    await testCache.set(`test${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);

  console.log("Items_Per_MS: " + itemPerMS);
  // Test the speed of write to cache.
  // original  : 350 wps
  // 2022.4.19 : 500 wps
  expect(itemPerMS).toBeGreaterThan(500);

  // Test the size of cache.
  expect(await testCache.size()).toBe(itemsCount);

  await testCache.purge();
  expect(await testCache.size()).toBe(0);

});
