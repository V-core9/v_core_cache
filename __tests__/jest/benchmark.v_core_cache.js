const V_Core_Cache = require("../..");
const cache = new V_Core_Cache();

test("Bunch of items adding/size check/clear", async () => {
  expect((await cache.stats()).count).toBe(0);

  const itemsCount = 1000000;

  // WRITE/SET Speed Test
  let startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    await cache.set(`_${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);


  console.log("SET [write] - Items_Per_MS: " + itemPerMS);
  expect(itemPerMS).toBeGreaterThan(450);


  // Test the size of cache.
  let stats = await cache.stats();
  expect(stats.count).toBe(itemsCount);

  console.log("Items_Size : " + stats.size);


  // READ/GET Speed Test
  startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    await cache.get(`_${i}`);
  }
  endTS = Date.now();
  itemPerMS = itemsCount / (endTS - startTS);

  console.log("GET [read] - Items_Per_MS: " + itemPerMS);
  expect(itemPerMS).toBeGreaterThan(900);



  // Purge to 0
  await cache.purge();
  expect((await cache.stats()).count).toBe(0);
});
