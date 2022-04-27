const EventEmitter = require('events');


// Fix expires initialization
const fixInputExpires = (expires) => {
  return (expires !== null && isNaN(expires)) ? expires : null;
};

// Check if the item is alive || Not expired yet/ever
const alive = async (ttl) => {
  return (ttl > Date.now() || ttl == false);
};



module.exports = class V_Core_Cache extends EventEmitter {
  constructor(init = {}) {
    super();


    let hits = 0;
    let misses = 0;
    let defaultExpires = null;
    let cache = {};

    this.count = async () => Object.keys(cache).length;


    defaultExpires = fixInputExpires(init.expires) || null;


    this.getAll = async () => cache;


    this.get = async (key = null) => {
      let data = cache[key];

      let value = (data !== undefined) ? data.value || undefined : undefined;

      this.emit('get', { key, value });

      if (data === undefined) {
        misses++;
        this.emit('miss', { key: key });
        return undefined;
      }

      if (await alive(data.expires)) {
        hits++;
        this.emit('hit', { key, value });
        return data.value;
      } else {
        misses++;
        this.emit('miss', { key: key });
        delete cache[key];
        return undefined;
      }
    };

    this.getExpire = async (key) => cache[key].expires || undefined;

    this.set = async (key, value, expires = defaultExpires) => {
      let data = {
        value: value,
        expires: (isNaN(expires) || expires == null) ? false : (Date.now() + expires)
      };
      cache[key] = data;
      this.emit('set', { key, value });
      return true;
    };


    this.has = async (key) => {
      let data = cache[key];
      return (data != undefined) ? await alive(data.expires) : false;
    };


    this.del = async (key) => (await this.has(key)) ? delete cache[key] : false;

    this.purge = async () => {
      if (await this.count() === 0) {
        this.emit('purge', false);
        return false;
      }

      cache = {};
      let rez = (await this.count() === 0);
      this.emit('purge', rez);
      return rez;
    };


    this.keys = async () => Object.keys(cache);

    this.values = async () => Object.values(cache);

    this.entries = async () => Object.entries(cache);

    this.toJSON = async () => JSON.stringify(cache);


    this.fromJSON = async (json) => {
      try {
        cache = JSON.parse(json);
        return true;
      } catch (error) {
        return false;
      }
    };

    this.toString = async () => this.toJSON();

    this.fromString = async (string) => this.fromJSON(string);


    /*
     * Stats
     */

    this.size = async () => new TextEncoder().encode(JSON.stringify(await this.getAll())).length;

    this.stats = async () => {
      return {
        hits: hits,
        misses: misses,
        count: await this.count(),
        size: await this.size(),
      };
    };

    this.purgeStats = async () => {
      hits = 0;
      misses = 0;

      let stats = await this.stats();
      this.emit('purge_stats', stats);
      return stats;
    };

  }
};

