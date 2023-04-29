const { isEmptySync } = require("v_is_empty_value");

import { InitProps, CacheItem } from "../index";
import { EventEmitter } from "events";
const { isAlive, defineExpire } = require("./utils");

export class V_Core_Cache {
  private clInt: any = null;
  purge: () => Promise<boolean>;
  count: () => Promise<number>;
  getAll: () => Promise<Map<any, any>>;
  get: (key: string | number) => Promise<any>;
  getSync: (key: string | number) => any;
  getExpire: (key: string | number) => Promise<any>;
  set: (key: string | number, value: any, exp?: number) => Promise<boolean>;
  setSync: (key: string | number, value: any, exp?: number) => boolean;
  del: (key: string | number) => Promise<boolean>;
  delSync: (key: any) => boolean;
  has: (key: string | number) => Promise<boolean>;
  cleanup: () => Promise<number>;
  keys: () => Promise<IterableIterator<any>>;
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
  values: () => Promise<IterableIterator<any>>;
  entries: () => Promise<IterableIterator<[any, any]>>;
  on: (evName: string, evCb: () => void) => void;
  addListener: (evName: string, evCb: () => void) => void;
  removeListener: (evName: string, evCb: () => void) => void;
  off: (evName: string, evCb: () => void) => void;
  stopCleanup: () => Promise<boolean>;
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
      emitter.emit("miss", { key: key });
      return undefined;
    };

    this.get = async (key) => this.getSync(key);

    //? Get Item Expire Time
    this.getExpire = async (key) =>
      $.has(key) !== false ? $.get(key).exp : undefined;

    //? Set Item Value & Expire Time
    this.setSync = (key, value, exp = defExp) => {
      if (isEmptySync(value)) return;
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
      if ((await this.count()) === 0) {
        emitter.emit("purge", false);
        return false;
      }

      $.clear();
      let rez = (await this.count()) === 0;
      emitter.emit("purge", rez);
      return rez;
    };

    this.cleanup = async () => {
      let affected = 0;
      for (let key of await this.keys()) {
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
        count: await this.count(),
        size: await this.size(),
      };
    };
    //*> SYNC
    this.statsSync = () => {
      return {
        hits: hits,
        misses: miss,
        count: this.countSync(),
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
    this.keys = async () => $.keys();

    //? VALUES
    this.values = async () => $.values();

    //? ENTRIES
    this.entries = async () => $.entries();

    //* Add Event Listener
    this.addListener = (eventName, evCallback) => {
      if (!eventName || !evCallback) return false;
      const evE = emitter.emit("addListener", { eventName, evCallback });
      const evR = emitter.addListener(eventName, evCallback);
      return !evE && !evR;
    };
    //* [alias] this.on -> this.addListener
    this.on = this.addListener;

    //* Remove Event Listener
    this.removeListener = async (eventName, evCallback) => {
      if (!eventName || !evCallback) return false;
      const evE = emitter.emit("removeListener", { eventName, evCallback });
      const evR = emitter.removeListener(eventName, evCallback);
      return !evE && !evR;
    };
    //* [alias] this.off -> this.removeListener
    this.off = this.removeListener;

    //! End the cleanup interval looping
    this.stopCleanup = async () => {
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
