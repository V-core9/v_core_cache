const logger = require('../logger')
const { V_Core_Cache } = require('../../')
const cache = new V_Core_Cache({ cleanInterval: 100, expires: 10000 })

const delayCount = (delay) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        resolve(cache.count())
      }, delay)
    } catch (err) {
      reject(err)
    }
  })
}

test('cache', async () => {
  expect(cache.count()).toBe(0)

  expect(cache.get('test')).toBe(undefined)

  expect(cache.set('test1', 1, 1500)).toBe(true)
  expect(cache.set('test2', 2, 2000)).toBe(true)
  expect(cache.set('test3', 3, 3000)).toBe(true)

  expect(cache.count()).toBe(3)

  expect(cache.get('test1')).toBe(1)
  expect(cache.get('test2')).toBe(2)
  expect(cache.get('test3')).toBe(3)

  expect(await delayCount(250)).toBe(3) // 250ms after
  expect(await delayCount(250)).toBe(3) // 500ms after
  expect(await delayCount(250)).toBe(3) // 750ms after
  expect(await delayCount(250)).toBe(3) // 1000ms after

  expect(await delayCount(550)).toBe(2) // 1550ms after
  expect(await delayCount(1000)).toBe(1) // 2550ms after

  expect(cache.stopCleanup()).toBe(true)
  expect(cache.stopCleanup()).toBe(false)
})
