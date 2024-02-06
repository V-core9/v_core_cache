import { isEmpty } from 'v_is_empty_value'
import { EventEmitter } from 'events'
import { isAlive, defineExpire, Add_Listener, Remove_Listener, Prepend_Listener, makeEvHandler } from './utils'

export class V_Core_Cache {
  constructor(init = {}) {
    // super();

    const emitter = new EventEmitter()

    let hits = 0
    let miss = 0

    const cleanInterval = init.cleanInterval || false
    let clInt = null

    let defExp = defineExpire(init.expires) ? init.expires : null
    let $ = new Map()


    //* Cache Items Count
    this.count = async () => $.size
    this.countSync = () => $.size

    //* All
    this.getAll = async () => $

    //? Get Item
    this.getSync = (key) => {
      let data = $.get(key)

      let value = data !== undefined ? data.value : undefined

      emitter.emit('get', { key, value })

      if (value !== undefined) {
        if (isAlive(data.exp)) {
          hits++
          emitter.emit('hit', { key, value })
          return value
        }
        $.delete(key)
      }

      miss++
      emitter.emit('miss', { key })
      return undefined
    }

    this.get = async (key) => this.getSync(key)

    //? Get Item Expire Time
    this.getExpire = async (key) => ($.has(key) !== false ? $.get(key).exp : undefined)

    //? Set Item Value & Expire Time
    this.setSync = (key, value, exp = defExp) => {
      if (isEmpty(value)) return false
      $.set(key, {
        value: value,
        exp: typeof exp === 'number' ? Date.now() + exp : false
      })
      emitter.emit('set', { key, value })
      emitter.emit(`set/${key}`, value)
      return true
    }

    this.set = async (key, value, exp = defExp) => this.setSync(key, value, exp)

    //? Delete / Remove item from cache
    this.del = async (key) => $.delete(key)
    this.delSync = (key) => $.delete(key)

    //? Check if has
    this.has = async (key) => {
      let data = $.get(key)
      return data != undefined ? isAlive(data.exp) : false
    }

    //! PURGE Cache
    this.purge = async () => {
      if ($.size === 0) {
        emitter.emit('purge', false)
        return false
      }

      $.clear()
      let rez = $.size === 0
      emitter.emit('purge', rez)
      return rez
    }

    this.cleanup = async () => {
      let affected = 0
      for (let key of this.keys()) {
        if (!isAlive($.get(key).exp)) {
          $.delete(key)
          affected++
        }
      }
      emitter.emit('cleanup', affected)
      return affected
    }

    //? Size Aproximation
    this.sizeSync = () => new TextEncoder().encode(JSON.stringify(Array.from($.entries()))).length
    this.size = async () => this.sizeSync()

    //? Stats
    //*> ASYNC
    this.stats = async () => {
      return {
        hits: hits,
        misses: miss,
        count: $.size,
        size: await this.size()
      }
    }
    //*> SYNC
    this.statsSync = () => {
      return {
        hits: hits,
        misses: miss,
        count: $.size,
        size: this.sizeSync()
      }
    }

    //? PurgeStats
    this.purgeStats = async () => {
      hits = 0
      miss = 0

      let stats = await this.stats()
      emitter.emit('purgeStats', stats)
      return stats
    }

    //? KEYS
    this.keys = () => $.keys()

    //? VALUES
    this.values = $.values

    //? ENTRIES
    this.entries = $.entries

    //* Create Event Listener
    this.addListener = makeEvHandler(Add_Listener, emitter)
    this.removeListener = makeEvHandler(Remove_Listener, emitter)
    this.prependListener = makeEvHandler(Prepend_Listener, emitter)

    //? Aliases
    this.on = this.addListener
    this.off = this.removeListener
    this.pre = this.prependListener

    //! End the cleanup interval looping
    this.stopCleanup = () => {
      if (clInt === null) return false

      clearInterval(clInt)
      clInt = null
      return true
    }

    this.startCleanup = () => {
      if (clInt !== null) return false

      clInt = setInterval(this.cleanup, cleanInterval)
      return true
    }

    //? Get list of registered events
    this.eventNames = () => emitter.eventNames()

    //? Remove All listeners from event [eventName]
    this.removeAllListeners = emitter.removeAllListeners

    //! Un-Hook ALL EventNames and Listeners
    this.purgeAllListeners = () => {
      const eventNames = emitter.eventNames()
      for (let i = 0; i < eventNames.length; i++) {
        const evName = eventNames[i]
        emitter.removeAllListeners(evName)
      }
      return this.eventNames().length === 0
    }

    //? Start Cleanup Interval if not disabled.
    if (cleanInterval !== false) this.startCleanup()
  }
}

export const createCache = (props) => new V_Core_Cache(props)

