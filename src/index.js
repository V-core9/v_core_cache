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



    defaultExpires = fixInputExpires(init.expires) || null;


    this.getAll = async () => cache;


    this.get = async (key = null) => {
      let data = cache[key];

      this.emit('get', data);

      if (data === undefined) {
        misses++;
        this.emit('miss', data);
        return undefined;
      }

      if (await alive(data.expires)) {
        hits++;
        this.emit('hit', data);
        return data.value;
      } else {
        misses++;
        this.emit('miss', data);
        delete cache[key];
        return undefined;
      }
    };


    this.set = async (key, value, expires = defaultExpires) => {
      let data = {
        value: value,
        expires: (isNaN(expires) || expires == null) ? false : (Date.now() + expires)
      };
      cache[key] = data;
      data.name = key;
      this.emit('set', data);
      return true;
    };


    this.has = async (key) => {
      let data = cache[key];
      return (data != undefined) ? await alive(data.expires) : false;
    };


    this.del = async (key) => (await this.has(key)) ? delete cache[key] : false;

    this.purge = async () => {
      if (await this.size() === 0) {
        this.emit('purge', false);
        return false;
      }

      cache = {};
      let rez = (await this.size() === 0);
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



    this.toString = async () => {
      return this.toJSON();
    };


    this.fromString = async (string) => {
      return this.fromJSON(string);
    };


    /*
     * Stats
     */
    this.hits = async () => hits;

    this.misses = async () => misses;

    this.size = async () => Object.keys(cache).length;

    this.stats = async () => {
      return {
        hits: await this.hits(),
        misses: await this.misses(),
        size: await this.size()
      };
    };

  }
};

