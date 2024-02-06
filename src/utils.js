export const Add_Listener = 'addListener'
export const Remove_Listener = 'removeListener'
export const Prepend_Listener = 'prependListener'

export const defineExpire = (expire) => (expire === undefined ? false : expire !== null && !isNaN(expire) && expire > 0)

export const isAlive = (ttl) => !ttl || (typeof ttl === 'number' && ttl > Date.now())

export const makeEvHandler = (ev, emitter) => (eventName, evCallback) => {
  if (!eventName || !evCallback) return false

  if (ev === Add_Listener || eventName === Remove_Listener) emitter.emit(ev, { eventName, evCallback })

  if (ev === Remove_Listener) {
    if (emitter.eventNames().indexOf(eventName) === -1) return false
  }

  const evR = emitter[ev](eventName, evCallback)

  return !!evR
}

