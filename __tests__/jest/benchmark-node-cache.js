const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

test("Bunch of items adding/size check/clear", () => {

  const itemsCount = 1000000;

  // WRITE/SET Speed Test
  let startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    cache.set(`_${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);


  console.log("SET [write] - Items_Per_MS: " + itemPerMS);
  //expect(itemPerMS).toBeGreaterThan(450);


  // Test the size of cache.
  let stats = cache.getStats();
  expect(stats.keys).toBe(itemsCount);

  console.log("Items_Size : " + stats.vsize);


  // READ/GET Speed Test
  startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    cache.get(`_${i}`);
  }
  endTS = Date.now();
  itemPerMS = itemsCount / (endTS - startTS);

  console.log("GET [read] - Items_Per_MS: " + itemPerMS);
  expect(itemPerMS).toBeGreaterThan(900);



  // Purge to 0
  cache.flushAll();
  expect((cache.getStats()).keys).toBe(0);
});
