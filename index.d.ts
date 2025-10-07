export interface InitProps {
  cleanInterval?: number;
  expires?: number;
}

type CacheItemIdentifier = string | number;

type CacheItemSpread = [
  key: CacheItemIdentifier,
  value: any,
  exp: number | undefined
];

type EventManager = (evName: string, evCb: () => void) => void;

export declare class V_Core_Cache {
  private clInt;
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
  addListener: EventManager;
  prependListener: EventManager;
  removeListener: EventManager;
  on: EventManager;
  pre: EventManager;
  off: EventManager;
  stopCleanup: () => boolean;
  countSync: () => number;
  sizeSync: () => number;
  eventNames: () => (string | symbol)[];
  removeAllListeners: (eventName: string | symbol) => void;
  purgeAllListeners: () => boolean;
  constructor(init?: InitProps);
}

export declare const createCache: (props: any) => V_Core_Cache;

export {};
