const V_Core_Cache = require('../..');
const testCache = new V_Core_Cache();

let items = {
  set: 0,
  get: 0,
  hit: 0,
  miss: 0,
  purge: 0,
  purgeStats: 0
};

testCache.on('hit', (data) => {
  items.hit++;
});

testCache.on('miss', (data) => {
  items.miss++;
});

testCache.on('get', (data) => {
  items.get++;
});

testCache.on('set', (data) => {
  items.set++;
});

testCache.on('purge', (data) => {
  items.purge++;
});

testCache.on('purge_stats', (data) => {
  console.log('<purge_stats - cb>', data);
  items.purgeStats++;
});

test("Testing events", async () => {

  expect((await testCache.stats()).count).toBe(0);

  const itemsCount = 1000000;
  for (let i = 0; i < itemsCount; i++) {
    await testCache.set(`test${i}`, i);
  }

  expect(items.set).toBe(itemsCount);

  for (let i = 0; i < itemsCount * 2; i++) {
    await testCache.get(`test${i}`, i);
  }


  //console.log(items);
  expect(items.get).toBe(itemsCount * 2);
  expect(items.hit).toBe(itemsCount);
  expect(items.miss).toBe(itemsCount);

  expect((await testCache.stats()).count).toBe(itemsCount);

  let stats = await testCache.stats();
  expect(stats.hits).toBe(items.hit);
  expect(stats.misses).toBe(items.miss);
  expect(stats.count).toBe(itemsCount);

  expect(await testCache.purge()).toBe(true);
  expect((await testCache.stats()).count).toBe(0);

  expect(items.purge).toBe(1);

  let purgeStats = await testCache.purgeStats();
  expect(purgeStats.hits).toBe(0);
  expect(purgeStats.misses).toBe(0);

  expect(items.purgeStats).toBe(1);

});
