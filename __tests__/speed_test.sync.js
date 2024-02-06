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
  expect(itemPerMS).toBeGreaterThan(375)

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
  expect(itemPerMS).toBeGreaterThan(900)

  // Purge to 0
  cache.purge()
  expect(cache.stats().count).toBe(0)
})
