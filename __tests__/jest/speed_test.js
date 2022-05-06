const V_Core_Cache = require("../..");
const cache = new V_Core_Cache();

test("Bunch of items adding/size check/clear", async () => {
  expect((await cache.stats()).count).toBe(0);

  let startTS = Date.now();
  const itemsCount = 1000000;
  for (let i = 0; i < itemsCount; i++) {
    await cache.set(`test${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);

  console.log("Items_Per_MS: " + itemPerMS);
  // Test the speed of write to cache.
  // original   : ~350 wpms
  // 2022.04.19 : >500 wpms [ Ryzen 7 2700X ]
  // 2022.05.06 : ~300 wpms [ Ryzen 5 3500U ]
  //              ~385 wpms after some fixes.
  expect(itemPerMS).toBeGreaterThan(300);

  // Test the size of cache.
  let stats = await cache.stats();
  expect(stats.count).toBe(itemsCount);

  console.log("Items_Size : " + stats.size);

  await cache.purge();
  expect((await cache.stats()).count).toBe(0);
});
