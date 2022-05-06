
const V_Core_Cache = require('../..');
const cache = new V_Core_Cache();


let demoObj = {
  name: 'yea',
  count: 11,
  info: false
};


const delayed = async (name, delay, type) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(await cache[type](name));
      }, delay);
    } catch (err) {
      reject(err);
    }
  });
};

const delayHas = async (name, delay) => delayed(name, delay, 'has');
const delayGet = async (name, delay) => delayed(name, delay, 'get');



test("main test", async () => {
  expect((await cache.stats()).count).toBe(0);

  expect(await cache.get('test')).toBe(undefined);

  expect(await cache.set('test', 11)).toBe(true);

  expect(await cache.get('test')).toBe(11);
  expect(await delayGet('test', 1000)).toBe(11);


  expect(await cache.set('DemoInfo1', demoObj, 100)).toBe(true);

  expect((await cache.stats()).count).toBe(2);

  expect(await delayGet('DemoInfo1', 10)).toBe(demoObj);
  expect(await delayGet('DemoInfo1', 500)).toBe(undefined);


  expect(await cache.has('test')).toBe(true);


  expect(await cache.has('test_Del')).toBe(false);
  expect(await cache.set('test_Del', `D1110`)).toBe(true);

  //console.log(await cache.getAll());

  expect((await cache.stats()).count).toBe(2);


  expect(await cache.has('test_Del')).toBe(true);
  expect(await cache.get('test_Del')).toBe(`D1110`);

  expect(await cache.del('test_Del')).toBe(true);
  expect(await cache.get('test_Del')).toBe(undefined);
  expect((await cache.stats()).count).toBe(1);


  expect(await cache.has('test')).toBe(true);

  let nowTime = Date.now();
  expect(await cache.set('Demo12345', demoObj, 100)).toBe(true);

  expect(await cache.getExpire('Demo12345')).toBe(nowTime + 100);

  expect(await delayHas('Demo12345', 10)).toBe(true);
  expect(await delayHas('Demo12345', 500)).toBe(false);

  const statsPurge = await cache.purgeStats();
  console.log(statsPurge);
  expect(statsPurge.count).toBe(2);
  expect(statsPurge.hits).toBe(0);
  expect(statsPurge.misses).toBe(0);
});
