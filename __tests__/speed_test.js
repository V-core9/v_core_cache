const V_Cache = require('..');
const testCache = new V_Cache();

test("Bunch of items adding/size check/clear", async () => {

  expect(await testCache.size()).toBe(0);

  let startTS = Date.now();
  const itemsCount = 1000000;
  for (let i = 0; i < itemsCount; i++) {
    await testCache.set(`test${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);

  // Test the speed of write to cache. Currently greater than 350 items per ms. [ 350 000 writes per second ]
  expect(itemPerMS).toBeGreaterThan(350);

  // Test the size of cache.
  expect(await testCache.size()).toBe(itemsCount);

  await testCache.purge();
  expect(await testCache.size()).toBe(0);

});
