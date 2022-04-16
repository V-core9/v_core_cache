const V_Cache = require('..');
const vCache = new V_Cache();


const getAfterDelay = async (name, delay) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(await vCache.get(name));
      }, delay);
    } catch (err) {
      reject(err);
    }
  });
};


test("vCache.size() = 0", async () => {
  expect(await vCache.size()).toBe(0);
});


test("vCache.get('test')", async () => {
  expect(await vCache.get('test')).toBe(null);
});


test("vCache.set('test', 11)", async () => {
  expect(await vCache.set('test', 11)).toBe(11);
});


test("vCache.get('test')", async () => {
  expect(await vCache.get('test')).toBe(11);
  expect(await getAfterDelay('test', 1000)).toBe(11);
});


test("DemoInfo1  Set/Get/GetAfterExpired", async () => {

  let demoObj = {
    name: 'yea',
    count: 11,
    info: false
  };

  await vCache.set('DemoInfo1', demoObj, 100);

  expect(await getAfterDelay('DemoInfo1', 10)).toBe(demoObj);
  expect(await getAfterDelay('DemoInfo1', 500)).toBe(null);

});


test("Check Cache Size", async () => {
  expect(await vCache.size()).toBe(2);
});


test("vCache.toFile('demo.json')", async () => {
  expect(await vCache.toFile('demo.json')).toBe(true);
});


test("Add and Remove Item", async () => {

  await vCache.set('test_Del', `D1110`);
  expect(await vCache.get('test_Del')).toBe(`D1110`);
  expect(await vCache.size()).toBe(3);

  await vCache.remove('test_Del');
  expect(await vCache.get('test_Del')).toBe(null);
  expect(await vCache.size()).toBe(2);

});


test("Bunch of items adding/size check/clear", async () => {
  // Just a delay to the rest of this test to get it clean from top parts.
  let helperVal1 = await getAfterDelay('helperVal1', 1000);

  // Clean before use :D
  await vCache.clear();
  expect(await vCache.size()).toBe(0);

  let startTS = Date.now();
  const itemsCount = 1000000;
  for (let i = 0; i < itemsCount; i++) {
    await vCache.set(`test${i}`, i);
  }
  let endTS = Date.now();
  let itemPerMS = itemsCount / (endTS - startTS);

  // Test the speed of write to cache. Currently greater than 350 items per ms. [ 350 000 writes per second ]
  expect(itemPerMS).toBeGreaterThan(350);

  // Test the size of cache.
  expect(await vCache.size()).toBe(itemsCount);

  await vCache.clear();
  expect(await vCache.size()).toBe(0);
});
