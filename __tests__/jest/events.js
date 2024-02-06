const logger = require('../logger')
const { V_Core_Cache } = require('../../')
const testCache = new V_Core_Cache()

const testKeyName = 'demo_key_identifier'

let items = {
  set: 0,
  get: 0,
  hit: 0,
  miss: 0,
  purge: 0,
  purgeStats: 0,
  addListener: 0,
  removeListener: 0,

  // Specific like `set/${testKeyName}`
  specificEventSet: 0
}

//? 1.
const addListener = (data) => items.addListener++
//? 2.
const purgeStats = (data) => items.purgeStats++
//? 3.
const hit = (data) => items.hit++
//? 4.
const miss = (data) => items.miss++
//? 5.
const get = (data) => items.get++
//? 6.
const set = (data) => items.set++
//? 7.
const purge = (data) => items.purge++
//? 8.
const removeListener = (data) => items.removeListener++

test('Testing events', () => {
  testCache.on('addListener', addListener)
  testCache.on('removeListener', removeListener)
  testCache.on('purgeStats', purgeStats)
  testCache.on('purge', purge)
  testCache.on('set', set)
  testCache.on('get', get)
  testCache.on('hit', hit)
  testCache.on('miss', miss)

  expect(testCache.stats().count).toBe(0)

  const itemsCount = 10000
  for (let i = 1; i <= itemsCount; i++) {
    testCache.set(`test${i}`, i)
  }

  expect(items.set).toBe(itemsCount)

  for (let i = 1; i <= itemsCount * 2; i++) {
    testCache.get(`test${i}`)
  }

  logger(items)
  expect(items.addListener).toBe(7)
  expect(items.removeListener).toBe(0)
  expect(items.get).toBe(itemsCount * 2)
  expect(items.hit).toBe(itemsCount)
  expect(items.miss).toBe(itemsCount)

  expect(testCache.stats().count).toBe(itemsCount)

  let stats = testCache.stats()
  expect(stats.hits).toBe(items.hit)
  expect(stats.misses).toBe(items.miss)
  expect(stats.count).toBe(itemsCount)

  expect(testCache.purge()).toBe(true)
  expect(testCache.purge()).toBe(false)
  expect(testCache.stats().count).toBe(0)

  expect(items.purge).toBe(2)

  let purgeStatsData = testCache.purgeStats()
  expect(purgeStatsData.hits).toBe(0)
  expect(purgeStatsData.misses).toBe(0)

  logger(items)
  expect(items.purgeStats).toBe(1)

  testCache.on(`set/${testKeyName}`, (data) => {
    items.specificEventSet++
  })

  for (let i = 1; i <= 125; i += 1) {
    testCache.set(testKeyName, {
      nmb: Math.trunc(Math.random() * 1000000),
      txt: (Math.random() + 1).toString(36)
    })
  }

  expect(items.specificEventSet).toBe(125)

  expect(testCache.eventNames().length).toBe(9)
  //- - - - - - - - - - - - - - - - - - - - -
  // Test: OFF / Remove Listener - - - - -

  testCache.off('addListener', addListener)
  testCache.off('purgeStats', purgeStats)
  testCache.off('purge', purge)
  testCache.off('set', set)
  testCache.off('get', get)
  testCache.off('hit', hit)
  testCache.off('miss', miss)
  testCache.off('removeListener', removeListener)

  expect(items.removeListener).toBe(8)

  expect(testCache.off(`unknown___key`, removeListener)).toBe(false)

  expect(testCache.off(`unknown___id_key`, miss)).toBe(false)

  expect(testCache.off(/'XX'/, null)).toBe(false)

  expect(testCache.purgeAllListeners()).toBe(true)
})
