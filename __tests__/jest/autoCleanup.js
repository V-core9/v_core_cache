const logger = require('../logger')
const { V_Core_Cache } = require('../../')
const cache = new V_Core_Cache({ cleanInterval: 100, expires: 10000 })

const delayCount = async (delay) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(await cache.count())
      }, delay)
    } catch (err) {
      reject(err)
    }
  })
}

test('cache', async () => {
  expect(await cache.count()).toBe(0)

  expect(await cache.get('test')).toBe(undefined)

  expect(await cache.set('test1', 1, 1500)).toBe(true)
  expect(await cache.set('test2', 2, 2000)).toBe(true)
  expect(await cache.set('test3', 3, 3000)).toBe(true)

  expect(await cache.count()).toBe(3)

  expect(await cache.get('test1')).toBe(1)
  expect(await cache.get('test2')).toBe(2)
  expect(await cache.get('test3')).toBe(3)

  expect(await delayCount(250)).toBe(3) // 250ms after
  expect(await delayCount(250)).toBe(3) // 500ms after
  expect(await delayCount(250)).toBe(3) // 750ms after
  expect(await delayCount(250)).toBe(3) // 1000ms after

  expect(await delayCount(550)).toBe(2) // 1550ms after
  expect(await delayCount(1000)).toBe(1) // 2550ms after

  expect(await cache.stopCleanup()).toBe(true)
  expect(await cache.stopCleanup()).toBe(false)
})
