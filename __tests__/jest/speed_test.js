const logger = require('../logger')

const { createCache } = require('../../')
const cache = createCache()

test('Bunch of items adding/size check/clear', async () => {
  expect((await cache.stats()).count).toBe(0)

  const itemsCount = 1000000

  // WRITE/SET Speed Test
  let startTS = Date.now()
  for (let i = 0; i < itemsCount; i++) {
    await cache.set(`_${i}`, i)
  }
  let endTS = Date.now()
  let itemPerMS = itemsCount / (endTS - startTS)

  logger('SET [write] - Items_Per_MS: ' + itemPerMS)
  expect(itemPerMS).toBeGreaterThan(150) // Cuz we are now emitting `set` and `set/${key}` event

  // Test the size of cache.
  let stats = await cache.stats()
  expect(stats.count).toBe(itemsCount)

  logger('Items_Size : ' + stats.size)

  // READ/GET Speed Test
  startTS = Date.now()
  for (let i = 0; i < itemsCount; i++) {
    await cache.get(`_${i}`)
  }
  endTS = Date.now()
  itemPerMS = itemsCount / (endTS - startTS)

  logger('GET [read] - Items_Per_MS: ' + itemPerMS)
  expect(itemPerMS).toBeGreaterThan(200)

  // Purge to 0
  await cache.purge()
  expect((await cache.stats()).count).toBe(0)

  //! REJECT Empty Values
  await cache.set('randomKey', undefined, 50)
  expect((await cache.stats()).count).toBe(0)

  await cache.set('sdasdasdasd', undefined, 150)
  expect((await cache.stats()).count).toBe(0)

  await cache.set(123123123, undefined, 250)
  expect((await cache.stats()).count).toBe(0)

  expect(await cache.countSync()).toBe(0)
})
