const { createCache } = require("../../dist");
const cache = createCache();

test("Bunch of items adding/size check/clear", async () => {
  expect((cache.statsSync()).count).toBe(0);

  const itemsCount = 1000000;

  // WRITE/SET Speed Test
  let startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    cache.setSync(`_${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);


  console.log("SET [write] - Items_Per_MS: " + itemPerMS);
  expect(itemPerMS).toBeGreaterThan(450);


  // Test the size of cache.
  let stats = cache.statsSync();
  expect(stats.count).toBe(itemsCount);

  console.log("Items_Size : " + stats.size);


  // READ/GET Speed Test
  startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    cache.getSync(`_${i}`);
  }
  endTS = Date.now();
  itemPerMS = itemsCount / (endTS - startTS);

  console.log("GET [read] - Items_Per_MS: " + itemPerMS);
  expect(itemPerMS).toBeGreaterThan(900);



  // Purge to 0
  await cache.purge();
  expect((cache.statsSync()).count).toBe(0);
});
