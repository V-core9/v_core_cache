/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./__tests__/webpack/source.js":
/*!*************************************!*\
  !*** ./__tests__/webpack/source.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const V_Core_Cache = __webpack_require__(/*! ../.. */ \"./index.js\");\r\nconst dataCache = new V_Core_Cache();\r\n\r\nconst renderCache = new V_Core_Cache();\r\n\r\n// Debug and Logging\r\nlet debug = false;\r\n\r\nconst log = async (...args) => {\r\n  if (debug) {\r\n    console.log(...args);\r\n  }\r\n};\r\n\r\n\r\n\r\n// Example Application\r\nconst actions = {\r\n  changeAppVersion: async () => await dataCache.set('application_version', document.querySelector('#customVersion').value),\r\n  changeAppTitle: async () => await dataCache.set('application_title', document.querySelector('#customTitle').value),\r\n  logStats: async () => log(await dataCache.stats()),\r\n  purgeCache: async () => await dataCache.purge(),\r\n  purgeCacheStats: async () => await dataCache.purgeStats(),\r\n  logAllCache: async () => log(await dataCache.getAll()),\r\n  logUndefinedItem: async () => log(await dataCache.get('logUndefinedItem')),\r\n};\r\n\r\n\r\nconst cache_stats_box = async () => {\r\n  let stats = await dataCache.stats();\r\n  return `<cache_stats_box>\r\n            <h3>Cache Stats:</h3>\r\n            <div>\r\n              <h5>Hits:</h5>\r\n              <p>${stats.hits}</p>\r\n            </div>\r\n            <div>\r\n              <h5>Misses:</h5>\r\n              <p>${stats.misses}</p>\r\n            </div>\r\n            <div>\r\n              <h5>Count:</h5>\r\n              <p>${stats.count}</p>\r\n            </div>\r\n            <div>\r\n              <h5>Size:</h5>\r\n              <p>${stats.size}</p>\r\n            </div>\r\n          </cache_stats_box>`;\r\n};\r\n\r\n\r\nconst app_info = async () => {\r\n  return `<app_info>\r\n            <h1>${await dataCache.get('application_title')}</h1>\r\n            <h2>Version: ${await dataCache.get('application_version')}</h2>\r\n          </app_info>`;\r\n};\r\n\r\nconst change_title_form = async () => {\r\n  return `<change_title_form>\r\n            <h3>Change Application Title:</h3>\r\n            <form_group>\r\n              <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await dataCache.get('application_title')}' />\r\n              <button action='changeAppTitle'>Change</button>\r\n            </form_group>\r\n          </change_title_form>`;\r\n};\r\n\r\nconst change_version_form = async () => {\r\n  return `<change_version_form>\r\n            <h3>Change Application Version:</h3>\r\n            <form_group>\r\n              <input type='text' id='customVersion' placeholder='Change Title to Something' value='${await dataCache.get('application_version')}' />\r\n              <button action='changeAppVersion'>Change</button>\r\n            </form_group>\r\n          </change_version_form>`;\r\n};\r\n\r\nconst cache_actions = async () => {\r\n  return `<cache_actions>\r\n            <h3>Cache Actions:</h3>\r\n            <button action='logUndefinedItem'>Log undefined Item</button>\r\n            <button action='logAllCache'>Log All Cache</button>\r\n            <button action='logStats'>Log Cache Stats</button>\r\n            <button action='purgeCacheStats'>Purge Stats</button>\r\n            <button action='purgeCache'>Purge Cache</button>\r\n          </cache_actions>`;\r\n};\r\n\r\nconst renderApp = async () => {\r\n  return `${await cache_stats_box()}\r\n          ${await change_title_form()}\r\n          ${await change_version_form()}\r\n          ${await cache_actions()}\r\n          ${await app_info()}`;\r\n}\r\n\r\nconst app = async (data) => {\r\n  let startTime = Date.now();\r\n  let happened = 'App Render Cache Update';\r\n  if (data.key === 'appRender') {\r\n    happened = 'App DOM Update';\r\n    document.querySelector('v_app').innerHTML = await renderCache.get(\"appRender\");\r\n  } else {\r\n    await renderCache.set(\"appRender\", await renderApp(), 16);\r\n  }\r\n  let endTime = Date.now() - startTime;\r\n  log(`${happened} in ${endTime}ms`);\r\n};\r\n\r\n\r\n\r\n// Run the whole thing\r\n(async () => {\r\n\r\n  dataCache.on('set', app);\r\n  renderCache.on('set', app);\r\n\r\n  dataCache.on('purge', async () => {\r\n    log('Cache Purged');\r\n    await app({});\r\n  });\r\n\r\n  dataCache.on('purge_stats', async (data) => {\r\n    log('purge_stats CB>>', data);\r\n  });\r\n\r\n  window.onclick = async (event) => {\r\n    let action = event.target.getAttribute('action');\r\n    if (actions[action] !== undefined) {\r\n      await actions[action]();\r\n    }\r\n  };\r\n\r\n  await dataCache.set('application_title', 'V_Core_Cache Example');\r\n  await dataCache.set('application_version', '1.0.0');\r\n\r\n  debug = true;\r\n\r\n  log(\"Data Cache: \", await dataCache.getAll());\r\n  log(\"Render Cache: \", await renderCache.getAll());\r\n})();\r\n\n\n//# sourceURL=webpack://v_core_cache/./__tests__/webpack/source.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__(/*! ./src */ \"./src/index.js\");\r\n\n\n//# sourceURL=webpack://v_core_cache/./index.js?");

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack://v_core_cache/./node_modules/events/events.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const EventEmitter = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\r\n\r\n\r\n// Check if the item is alive || Not expired yet/ever\r\nconst alive = (ttl) => ttl === false || ttl > Date.now();\r\n\r\nconst defineExpire = (expire) => {\r\n  if (expire === undefined) return false;\r\n  return (expire !== null && !isNaN(expire) && expire > 0);\r\n};\r\n\r\nclass V_Core_Cache extends EventEmitter {\r\n\r\n  constructor(init = {}) {\r\n    super();\r\n\r\n    let hits = 0;\r\n    let miss = 0;\r\n\r\n    const cleanInterval = typeof init.cleanInterval == 'number' ? init.cleanInterval : false;\r\n    let clInt = null;\r\n\r\n    let defExp = defineExpire(init.expires) ? init.expires : null;\r\n    let $ = new Map();\r\n\r\n\r\n    //* Cache Items Count\r\n    this.count = async () => $.size;\r\n\r\n\r\n    //* All\r\n    this.getAll = async () => $;\r\n\r\n\r\n    //? Get Item\r\n    this.get = async (key = null) => {\r\n      let data = $.get(key);\r\n\r\n      let value = data !== undefined ? data.value : undefined;\r\n\r\n      this.emit(\"get\", { key, value });\r\n\r\n\r\n      if (value !== undefined) {\r\n        if (alive(data.exp)) {\r\n          hits++;\r\n          this.emit(\"hit\", { key, value });\r\n          return value;\r\n        }\r\n        $.delete(key);\r\n      }\r\n\r\n      miss++;\r\n      this.emit(\"miss\", { key: key });\r\n      return undefined;\r\n\r\n    };\r\n\r\n\r\n    //? Get Item Expire Time\r\n    this.getExpire = async (key) => $.has(key) !== false ? $.get(key).exp : undefined;\r\n\r\n\r\n    //? Set Item Value & Expire Time\r\n    this.set = async (key, value, exp = defExp) => {\r\n      $.set(key,{\r\n        value: value,\r\n        exp: typeof exp === \"number\" ? Date.now() + exp : false,\r\n      });\r\n      this.emit(\"set\", { key, value });\r\n      return true;\r\n    };\r\n\r\n\r\n    //? Delete / Remove item from cache\r\n    this.del = async (key) => $.delete(key);\r\n\r\n\r\n    //? Check if has\r\n    this.has = async (key) => {\r\n      let data = $.get(key);\r\n      return data != undefined ? alive(data.exp) : false;\r\n    };\r\n\r\n\r\n    //! PURGE Cache\r\n    this.purge = async () => {\r\n      if ((await this.count()) === 0) {\r\n        this.emit(\"purge\", false);\r\n        return false;\r\n      }\r\n\r\n      $.clear();\r\n      let rez = (await this.count()) === 0;\r\n      this.emit(\"purge\", rez);\r\n      return rez;\r\n    };\r\n\r\n    this.cleanup = async () => {\r\n      let affected = 0;\r\n      for (let key of await this.keys()) {\r\n        if (!alive($.get(key).exp)) {\r\n          $.delete(key);\r\n          affected++;\r\n        }\r\n      }\r\n      return affected;\r\n    };\r\n\r\n\r\n    //? Size Aproximation\r\n    this.size = async () => new TextEncoder().encode(JSON.stringify(Array.from($.entries()))).length;\r\n\r\n\r\n    //? Stats\r\n    this.stats = async () => {\r\n      return {\r\n        hits: hits,\r\n        misses: miss,\r\n        count: await this.count(),\r\n        size: await this.size(),\r\n      };\r\n    };\r\n\r\n\r\n    //? PurgeStats\r\n    this.purgeStats = async () => {\r\n      hits = 0;\r\n      miss = 0;\r\n\r\n      let stats = await this.stats();\r\n      this.emit(\"purge_stats\", stats);\r\n      return stats;\r\n    };\r\n\r\n\r\n    //? KEYS\r\n    this.keys = async () => $.keys();\r\n\r\n\r\n    //? VALUES\r\n    this.values = async () => $.values();\r\n\r\n\r\n    //? ENTRIES\r\n    this.entries = async () => $.entries();\r\n\r\n\r\n    //! End the cleanup interval looping\r\n    this.stopCleanup = async () => {\r\n      if (clInt !== null) {\r\n        clearInterval(clInt);\r\n        clInt = null;\r\n        return true;\r\n      }\r\n      return false;\r\n    };\r\n\r\n    //? Start Cleanup Interval if set.\r\n    if (cleanInterval !== false) {\r\n      clInt = setInterval(this.cleanup, cleanInterval);\r\n    }\r\n\r\n  }\r\n\r\n};\r\n\r\n\r\nmodule.exports = V_Core_Cache;\r\n\r\nmodule.exports[\"default\"] = V_Core_Cache;\r\n\n\n//# sourceURL=webpack://v_core_cache/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./__tests__/webpack/source.js");
/******/ 	
/******/ })()
;