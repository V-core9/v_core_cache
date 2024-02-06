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

    this.entries =  $.entries
    this.keys = () => $.keys()
    this.values = () => $.values()
    this.del = (key) => $.delete(key)
    this.count = () => $.size

    this.getAll = () => $

    this.get = (key) => {
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

    this.getExpire = (key) => ($.has(key) !== false ? $.get(key).exp : undefined)

    this.set = (key, value, exp = defExp) => {
      if (isEmpty(value)) return false
      $.set(key, {
        value: value,
        exp: typeof exp === 'number' ? Date.now() + exp : false
      })
      emitter.emit('set', { key, value })
      emitter.emit(`set/${key}`, value)
      return true
    }

    this.has = (key) => {
      let data = $.get(key)
      return data != undefined ? isAlive(data.exp) : false
    }

    this.purge = () => {
      if ($.size === 0) {
        emitter.emit('purge', false)
        return false
      }

      $.clear()
      let rez = $.size === 0
      emitter.emit('purge', rez)
      return rez
    }

    this.cleanup = () => {
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

    this.size = () => new TextEncoder().encode(JSON.stringify(Array.from($.entries()))).length

    this.stats = () => ({
      hits: hits,
      misses: miss,
      count: $.size,
      size: this.size()
    })

    this.purgeStats = () => {
      hits = 0
      miss = 0

      let stats = this.stats()
      emitter.emit('purgeStats', stats)
      return stats
    }

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

