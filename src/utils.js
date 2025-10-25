export const Add_Listener = 'addListener'
export const Remove_Listener = 'removeListener'
export const Prepend_Listener = 'prependListener'

export function isAlive(ttl) {
  return !ttl || (typeof ttl === 'number' && ttl > Date.now())
}

export function makeEvHandler(ev, emitter) {
  return (eventName, evCallback) => {
    if (!eventName || !evCallback) return false

    if (ev === Add_Listener || eventName === Remove_Listener) emitter.emit(ev, { eventName, evCallback })

    if (ev === Remove_Listener) {
      if (emitter.eventNames().indexOf(eventName) === -1) return false
    }

    return !!emitter[ev](eventName, evCallback)
  }
}

