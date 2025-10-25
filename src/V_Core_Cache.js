import { isEmpty } from 'v_is_empty_value'
import { EventEmitter } from 'events'
import { isAlive, Add_Listener, Remove_Listener, Prepend_Listener, createEventHandler } from './utils'

const encodedStringSize = (encString) => new TextEncoder().encode(encString).length

function attachNewEventEmitter(instance) {
  const emitter = new EventEmitter()

  //? Get list of registered events
  instance.eventNames = () => emitter.eventNames()

  //? Remove All listeners from event [eventName]
  instance.removeAllListeners = (evName) => {
    const eventNamesStart = emitter.eventNames()

    if (typeof evName === 'string') emitter.removeAllListeners(evName)

    if (Array.isArray(evName)) {
      evName.forEach((eName) => emitter.removeAllListeners(eName))
    }

    if (typeof evName === 'undefined') {
      eventNamesStart.forEach((eName) => emitter.removeAllListeners(eName))
    }

    return eventNamesStart.length - emitter.eventNames().length
  }

  //* Create Event Listener
  instance.addListener = createEventHandler(Add_Listener, emitter)
  instance.removeListener = createEventHandler(Remove_Listener, emitter)
  instance.prependListener = createEventHandler(Prepend_Listener, emitter)

  //? Aliases
  instance.on = instance.addListener
  instance.off = instance.removeListener
  instance.pre = instance.prependListener

  return emitter
}

export class V_Core_Cache {
  constructor(init = {}) {
    //? Basic Stats for hit/miss when reading data
    let hits = 0
    let miss = 0

    const defaultExpireTime = parseInt(init.expires) || null
    // Time in MS for the cleanup interval function to run
    let cleanupIntervalTime = parseInt(init.cleanupIntervalTime) || null
    // Variable for cleaning interval
    let cleanupInterval = null

    //! ---------------------------------------
    //! [ EVENTS ]_____________________________

    const emitter = attachNewEventEmitter(this)

    const maybeEmit = (evName, data) => {
      if (typeof emitter !== 'undefined') emitter.emit(evName, data)
    }
    //! [ EOF: EVENTS ]________________________
    //! ---------------------------------------

    // Actual Map as cache space
    let $ = new Map()

    this.entries = () => $.entries()
    this.keys = () => $.keys()
    this.values = () => $.values()
    this.delete = (key) => $.delete(key)

    this.count = () => $.size
    this.getAll = () => $

    this.get = (key) => {
      let data = $.get(key)

      let value = data !== undefined ? data?.value : undefined

      maybeEmit('get', { key, value })

      if (value !== undefined) {
        if (isAlive(data.exp)) {
          hits++
          maybeEmit('hit', { key, value })
          return value
        }
        $.delete(key)
      }

      miss++
      maybeEmit('miss', { key })
      return undefined
    }

    this.getExpire = (key) => $.get(key)?.exp || undefined

    this.set = (key, value, exp = defaultExpireTime) => {
      if (isEmpty(value)) return false
      $.set(key, {
        value: value,
        exp: typeof exp === 'number' ? Date.now() + exp : false
      })
      maybeEmit('set', { key, value })
      maybeEmit(`set/${key}`, value)
      return true
    }

    this.has = (key) => {
      let data = $.get(key)
      return data != undefined ? isAlive(data.exp) : false
    }

    this.purge = () => {
      if ($.size === 0) {
        maybeEmit('purge', false)
        return false
      }

      $.clear()
      let rez = $.size === 0
      maybeEmit('purge', rez)
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
      maybeEmit('cleanup', affected)
      return affected
    }

    this.size = () => encodedStringSize(JSON.stringify($.entries()))

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
      maybeEmit('purgeStats', stats)
      return stats
    }

    //! End the cleanup interval looping
    this.stopCleanupInterval = () => {
      if (cleanupInterval === null) return false

      clearInterval(cleanupInterval)
      cleanupInterval = null
      return true
    }

    this.startCleanup = (clTime) => {
      if (cleanupInterval !== null) return false

      if (typeof clTime === 'number') cleanupIntervalTime = parseInt(clTime)

      if (!cleanupIntervalTime) return false

      cleanupInterval = setInterval(this.cleanup, cleanupIntervalTime)
      return true
    }

    //? Start Cleanup Interval if not disabled.
    if (typeof cleanupIntervalTime === 'number') this.startCleanup()
  }
}

export const createCache = (props) => new V_Core_Cache(props)

