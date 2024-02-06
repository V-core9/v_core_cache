const logger = require('../logger')

const { V_Core_Cache } = require('../../')
const cache = new V_Core_Cache()

let demoObj = {
  name: 'yea',
  count: 11,
  info: false
}

const delayed = (name, delay, type) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(cache[type](name))
      }, delay)
    } catch (err) {
      reject(err)
    }
  })
}

const delayHas = (name, delay) => delayed(name, delay, 'has')
const delayGet = (name, delay) => delayed(name, delay, 'get')

test('main test', async () => {
  expect(cache.stats().count).toBe(0)

  expect(cache.get('test')).toBe(undefined)

  expect(cache.set('test', 11)).toBe(true)

  expect(cache.get('test')).toBe(11)
  expect(await delayGet('test', 1000)).toBe(11)

  expect(cache.set('DemoInfo1', demoObj, 100)).toBe(true)

  expect(cache.stats().count).toBe(2)

  expect(await delayGet('DemoInfo1', 10)).toBe(demoObj)
  expect(await delayGet('DemoInfo1', 500)).toBe(undefined)

  expect(cache.has('test')).toBe(true)

  expect(cache.has('test_Del')).toBe(false)
  expect(cache.set('test_Del', `D1110`)).toBe(true)

  logger(cache.getAll())

  expect(cache.stats().count).toBe(2)

  expect(cache.has('test_Del')).toBe(true)
  expect(cache.get('test_Del')).toBe(`D1110`)

  expect(cache.del('test_Del')).toBe(true)
  expect(cache.get('test_Del')).toBe(undefined)
  expect(cache.stats().count).toBe(1)

  expect(cache.set('test_Del', `D1110`)).toBe(true)
  expect(cache.del('test_Del')).toBe(true)

  expect(cache.has('test')).toBe(true)

  let nowTime = Date.now()
  expect(cache.set('Demo12345', demoObj, 100)).toBe(true)

  expect(cache.getExpire('Demo12345')).toBe(nowTime + 100)
  expect(cache.getExpire()).toBe(undefined)

  expect(await delayHas('Demo12345', 10)).toBe(true)
  expect(await delayHas('Demo12345', 500)).toBe(false)

  const statsPurge = cache.purgeStats()
  logger(statsPurge)
  expect(statsPurge.count).toBe(2)
  expect(statsPurge.hits).toBe(0)
  expect(statsPurge.misses).toBe(0)
})
