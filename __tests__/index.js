const path = require("path");

const testFile = path.join(__dirname, 'demo.json');

const V_Core_Cache = require('..');
const cache = new V_Core_Cache();

const v_fs = require('v_file_system');


const getAfterDelay = async (name, delay) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(await cache.get(name));
      }, delay);
    } catch (err) {
      reject(err);
    }
  });
};


test("cache.size() = 0", async () => {
  expect(await cache.size()).toBe(0);
});


test("cache.get('test')", async () => {
  expect(await cache.get('test')).toBe(null);
});


test("cache.set('test', 11)", async () => {
  expect(await cache.set('test', 11)).toBe(11);
});


test("cache.get('test')", async () => {
  expect(await cache.get('test')).toBe(11);
  expect(await getAfterDelay('test', 1000)).toBe(11);
});


test("DemoInfo1  Set/Get/GetAfterExpired", async () => {

  let demoObj = {
    name: 'yea',
    count: 11,
    info: false
  };

  await cache.set('DemoInfo1', demoObj, 100);

  expect(await getAfterDelay('DemoInfo1', 10)).toBe(demoObj);
  expect(await getAfterDelay('DemoInfo1', 500)).toBe(null);

});


test("Check Cache Size", async () => {
  expect(await cache.size()).toBe(2);
});


test("Saving and Loading cache using a file", async () => {
  // Try to load non existing file
  expect(await cache.fromFile(testFile)).toBe(false);

  // Save to file
  expect(await cache.toFile(testFile)).toBe(true);

  // Load from file
  expect(await cache.fromFile(testFile)).toBe(true);

  // Remove the file
  await v_fs.deleteFile(testFile);
});


test("Add and Remove Item", async () => {

  await cache.set('test_Del', `D1110`);
  expect(await cache.get('test_Del')).toBe(`D1110`);
  expect(await cache.size()).toBe(3);

  await cache.del('test_Del');
  expect(await cache.get('test_Del')).toBe(null);
  expect(await cache.size()).toBe(2);

});
