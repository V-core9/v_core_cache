const v_fs = require('v_file_system');
const EventEmitter = require('events');


// Fix expires initialization
fixInputExpires = (expires) => {
  return (expires !== null && isNaN(expires)) ? expires : null;
};

// Check if the item is alive || Not expired yet/ever
alive = async (ttl) => {
  return (ttl > Date.now() || ttl == false);
};



let hits = 0;
let misses = 0;
let defaultExpires = null;
let cache = {};




module.exports = class V_Core_Cache extends EventEmitter {
  constructor(init = {}) {
    super();


    defaultExpires = fixInputExpires(init.expires) || null;


    this.getAll = async () => cache;


    this.get = async (key = null) => {
      let data = cache[key];

      if (data === undefined) {
        misses++;
        return undefined;
      }

      if (await alive(data.expires)) {
        hits++;
        this.emit('get', data);
        return data.value;
      } else {
        misses++;
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
      this.emit('set', data);
      return true;
    };


    this.has = async (key) => {
      let data = cache[key];
      return (data != undefined) ? await alive(data.expires) : false;
    };


    this.del = async (key) => {
      return (await this.has(key)) ? delete cache[key] : false;
    };


    this.purge = async () => {
      cache = {};
      return (cache == {});
    };


    this.keys = async () => {
      return Object.keys(cache);
    };


    this.values = async () => {
      return Object.values(cache);
    };


    this.entries = async () => {
      return Object.entries(cache);
    };



    this.toJSON = () => {
      return JSON.stringify(cache);
    };



    this.fromJSON = async (json) => {
      try {
        cache = JSON.parse(json);
        return true;
      } catch (error) {
        console.log(error);
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
     * Save cache to file
     */
    this.toFile = (filePath) => {
      return v_fs.writeSy(filePath, this.toJSON());
    };


    /*
     * Loading the file as cache data
     */
    this.fromFile = (filePath) => {
      const data = v_fs.readSy(filePath);
      return (data !== false) ? this.fromJSON(data) : false;
    };


    /*
     * Stats
     */
    this.hits = async () => {
      return hits;
    };


    this.misses = async () => {
      return misses;
    };


    this.size = async () => {
      return Object.keys(cache).length;
    };


    this.stats = async () => {
      return {
        hits: await this.hits(),
        misses: await this.misses(),
        size: await this.size()
      };
    };

  }
};

