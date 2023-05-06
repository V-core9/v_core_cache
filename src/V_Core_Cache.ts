const { isEmptySync } = require("v_is_empty_value");
import { EventEmitter } from "events";
const { isAlive, defineExpire } = require("./utils");

//? Type Definitions - - - -
export interface InitProps {
  cleanInterval?: number;
  expires?: number;
}

enum AddRemoveEventGeneratorEnum {
  Add = "addListener",
  Remove = "removeListener",
  Prepend = "prependListener",
}

type CacheItemIdentifier = string | number;

type CacheItemSpread = [
  key: CacheItemIdentifier, // cache item key
  value: any, // value to cache
  exp: number | undefined // expires in milliseconds
];

type EventManager = (evName: string, evCb: () => void) => void;
//! Type Definitions - - - - -

const createHandleAddRemoveEvent =
  (ev: AddRemoveEventGeneratorEnum, emitter: EventEmitter) =>
  (eventName, evCallback) => {
    if (!eventName || !evCallback) return false;
    if (
      ev === AddRemoveEventGeneratorEnum.Add ||
      eventName === AddRemoveEventGeneratorEnum.Remove
    )
      emitter.emit(ev, { eventName, evCallback });
    if (ev === AddRemoveEventGeneratorEnum.Remove) {
      if (emitter.eventNames().indexOf(eventName) === -1) return false;
    }
    const evR = emitter[ev](eventName, evCallback);
    return !!evR;
  };

export class V_Core_Cache {
  private clInt: any = null;
  purge: () => Promise<boolean>;
  count: () => Promise<number>;
  set: (...item: CacheItemSpread) => Promise<boolean>;
  setSync: (...item: CacheItemSpread) => boolean;
  getAll: () => Promise<Map<any, any>>;
  get: (key: CacheItemIdentifier) => Promise<any>;
  getSync: (key: CacheItemIdentifier) => any;
  getExpire: (key: CacheItemIdentifier) => Promise<any>;
  del: (key: CacheItemIdentifier) => Promise<boolean>;
  delSync: (key: CacheItemIdentifier) => boolean;
  has: (key: CacheItemIdentifier) => Promise<boolean>;
  cleanup: () => Promise<number>;
  keys: () => IterableIterator<any>;
  size: () => Promise<number>;
  stats: () => Promise<{
    hits: number;
    misses: number;
    count: number;
    size: number;
  }>;
  statsSync: () => {
    hits: number;
    misses: number;
    count: number;
    size: number;
  };
  purgeStats: () => Promise<{
    hits: number;
    misses: number;
    count: number;
    size: number;
  }>;
  values: () => IterableIterator<any>;
  entries: () => IterableIterator<[any, any]>;

  //? Events Management - - - - -
  addListener: EventManager;
  prependListener: EventManager;
  removeListener: EventManager;
  on: EventManager;
  pre: EventManager;
  off: EventManager;
  //! Events Management - - - - -

  stopCleanup: () => boolean;
  countSync: () => number;
  sizeSync: () => number;
  eventNames: () => (string | symbol)[];

  removeAllListeners: (eventName: string | symbol) => void;
  purgeAllListeners: () => boolean;

  constructor(init: InitProps = {}) {
    // super();

    const emitter = new EventEmitter();

    let hits = 0;
    let miss = 0;

    const cleanInterval = init.cleanInterval || false;

    let defExp = defineExpire(init.expires) ? init.expires : null;
    let $ = new Map();

    //* Cache Items Count
    this.count = async () => $.size;
    this.countSync = () => $.size;

    //* All
    this.getAll = async () => $;

    //? Get Item
    this.getSync = (key) => {
      let data = $.get(key);

      let value = data !== undefined ? data.value : undefined;

      emitter.emit("get", { key, value });

      if (value !== undefined) {
        if (isAlive(data.exp)) {
          hits++;
          emitter.emit("hit", { key, value });
          return value;
        }
        $.delete(key);
      }

      miss++;
      emitter.emit("miss", { key });
      return undefined;
    };

    this.get = async (key) => this.getSync(key);

    //? Get Item Expire Time
    this.getExpire = async (key) =>
      $.has(key) !== false ? $.get(key).exp : undefined;

    //? Set Item Value & Expire Time
    this.setSync = (key, value, exp = defExp) => {
      if (isEmptySync(value)) return false;
      $.set(key, {
        value: value,
        exp: typeof exp === "number" ? Date.now() + exp : false,
      });
      emitter.emit("set", { key, value });
      emitter.emit(`set/${key}`, value);
      return true;
    };

    this.set = async (key, value, exp = defExp) =>
      this.setSync(key, value, exp);

    //? Delete / Remove item from cache
    this.del = async (key) => $.delete(key);
    this.delSync = (key) => $.delete(key);

    //? Check if has
    this.has = async (key) => {
      let data = $.get(key);
      return data != undefined ? isAlive(data.exp) : false;
    };

    //! PURGE Cache
    this.purge = async () => {
      if ($.size === 0) {
        emitter.emit("purge", false);
        return false;
      }

      $.clear();
      let rez = $.size === 0;
      emitter.emit("purge", rez);
      return rez;
    };

    this.cleanup = async () => {
      let affected = 0;
      for (let key of this.keys()) {
        if (!isAlive($.get(key).exp)) {
          $.delete(key);
          affected++;
        }
      }
      emitter.emit("cleanup", affected);
      return affected;
    };

    //? Size Aproximation
    this.sizeSync = () =>
      new TextEncoder().encode(JSON.stringify(Array.from($.entries()))).length;
    this.size = async () => this.sizeSync();

    //? Stats
    //*> ASYNC
    this.stats = async () => {
      return {
        hits: hits,
        misses: miss,
        count: $.size,
        size: await this.size(),
      };
    };
    //*> SYNC
    this.statsSync = () => {
      return {
        hits: hits,
        misses: miss,
        count: $.size,
        size: this.sizeSync(),
      };
    };

    //? PurgeStats
    this.purgeStats = async () => {
      hits = 0;
      miss = 0;

      let stats = await this.stats();
      emitter.emit("purgeStats", stats);
      return stats;
    };

    //? KEYS
    this.keys = () => $.keys();

    //? VALUES
    this.values = () => $.values();

    //? ENTRIES
    this.entries = () => $.entries();

    //* Add Event Listener
    this.addListener = createHandleAddRemoveEvent(
      AddRemoveEventGeneratorEnum.Add,
      emitter
    );
    //* Remove Event Listener
    this.removeListener = createHandleAddRemoveEvent(
      AddRemoveEventGeneratorEnum.Remove,
      emitter
    );
    this.prependListener = createHandleAddRemoveEvent(
      AddRemoveEventGeneratorEnum.Prepend,
      emitter
    );

    //? Aliases
    this.on = this.addListener;
    this.off = this.removeListener;
    this.pre = this.prependListener;

    //! End the cleanup interval looping
    this.stopCleanup = () => {
      if (this.clInt !== null) {
        clearInterval(this.clInt);
        this.clInt = null;
        return true;
      }
      return false;
    };

    //? Get list of registered events
    this.eventNames = () => emitter.eventNames();

    //? Remove All listeners from event [eventName]
    this.removeAllListeners = emitter.removeAllListeners;

    //! Un-Hook ALL EventNames and Listeners
    this.purgeAllListeners = () => {
      const eventNames = emitter.eventNames();
      for (let i = 0; i < eventNames.length; i++) {
        const evName = eventNames[i];
        emitter.removeAllListeners(evName);
      }
      return this.eventNames().length === 0;
    };

    //? Start Cleanup Interval if set.
    if (cleanInterval !== false) {
      this.clInt = setInterval(this.cleanup, cleanInterval);
    }
  }
}
