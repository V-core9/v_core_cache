const logger = require('../logger')

const { createCache } = require('../../')
const cache = createCache()

test('Bunch of items adding/size check/clear', () => {
  expect(cache.stats().count).toBe(0)

  const itemsCount = 1000000

  // WRITE/SET Speed Test
  let startTS = Date.now()
  for (let i = 0; i < itemsCount; i++) {
    cache.set(`_${i}`, i)
  }
  let endTS = Date.now()
  let itemPerMS = itemsCount / (endTS - startTS)

  logger('SET [write] - Items_Per_MS: ' + itemPerMS)
  expect(itemPerMS).toBeGreaterThan(150) // Cuz we are now emitting `set` and `set/${key}` event

  // Test the size of cache.
  let stats = cache.stats()
  expect(stats.count).toBe(itemsCount)

  logger('Items_Size : ' + stats.size)

  // READ/GET Speed Test
  startTS = Date.now()
  for (let i = 0; i < itemsCount; i++) {
    cache.get(`_${i}`)
  }
  endTS = Date.now()
  itemPerMS = itemsCount / (endTS - startTS)

  logger('GET [read] - Items_Per_MS: ' + itemPerMS)
  expect(itemPerMS).toBeGreaterThan(200)

  // Purge to 0
  cache.purge()
  expect(cache.stats().count).toBe(0)

  //! REJECT Empty Values
  cache.set('randomKey', undefined, 50)
  expect(cache.stats().count).toBe(0)

  cache.set('sdasdasdasd', undefined, 150)
  expect(cache.stats().count).toBe(0)

  cache.set(123123123, undefined, 250)
  expect(cache.stats().count).toBe(0)

  expect(cache.count()).toBe(0)
})
