export const Add_Listener = 'addListener'
export const Remove_Listener = 'removeListener'
export const Prepend_Listener = 'prependListener'

export function isAlive(ttl) {
  return !ttl || (typeof ttl === 'number' && ttl > Date.now())
}

export function createEventHandler(action, emitter) {
  return function handleEvent(eventName, callback) {
    // 1️⃣ Validate input
    if (!eventName || typeof callback !== 'function') return false

    const isAdding = action === 'addListener' || action === 'on'
    const isRemoving = action === 'removeListener' || action === 'off'

    // 2️⃣ Emit meta-events (optional hooks for internal tracking)
    if (isAdding || eventName === 'removeListener') emitter.emit(action, { eventName, callback })

    // 3️⃣ Prevent removing non-existent events
    if (isRemoving) {
      const activeEvents = emitter.eventNames()
      if (!activeEvents.includes(eventName)) return false
    }

    // 4️⃣ Dynamically call emitter method: on(), off(), addListener(), removeListener(), etc.
    const method = emitter[action]
    if (typeof method !== 'function') return false

    method.call(emitter, eventName, callback)
    return true
  }
}

