const EventEmitter = require("events");


// Check if the item is alive || Not expired yet/ever
const alive = (ttl) => ttl === false || ttl > Date.now() ;


module.exports = class V_Core_Cache extends EventEmitter {
  constructor(init = {}) {
    super();

    let hits = 0;
    let miss = 0;
    let defExp = (init.expires !== null && !isNaN(init.expires) && init.expires > 0) ? init.expires : null;
    let $ = {};

    //* Cache Items Count
    this.count = async () => Object.keys($).length;

    //* All
    this.getAll = async () => $;

    //? Get Item
    this.get = async (key = null) => {
      let data = $[key];

      let value = data !== undefined ? data.value || undefined : undefined;

      this.emit("get", { key, value });

      if (data === undefined) {
        miss++;
        this.emit("miss", { key: key });
        return undefined;
      }

      if (alive(data.exp)) {
        hits++;
        this.emit("hit", { key, value });
        return data.value;
      } else {
        miss++;
        this.emit("miss", { key: key });
        delete $[key];
        return undefined;
      }
    };

    //? Get Item Expire Time
    this.getExpire = async (key) => $[key].exp || undefined;

    //? Set Item Value & Expire Time
    this.set = async (key, value, exp = defExp) => {
      $[key] = {
        value: value,
        exp:
          isNaN(exp) || exp == null ? false : Date.now() + exp,
      };
      this.emit("set", { key, value });
      return true;
    };

    //? Delete / Remove item from cache
    this.del = async (key) => ((await this.has(key)) ? delete $[key] : false);

    //? Check if has
    this.has = async (key) => {
      let data = $[key];
      return data != undefined ? alive(data.exp) : false;
    };

    //! PURGE Cache
    this.purge = async () => {
      if ((await this.count()) === 0) {
        this.emit("purge", false);
        return false;
      }

      $ = {};
      let rez = (await this.count()) === 0;
      this.emit("purge", rez);
      return rez;
    };

    //? Size Aproximation
    this.size = async () =>
      new TextEncoder().encode(JSON.stringify(await this.getAll())).length;

    /*
     * Stats
     */
    this.stats = async () => {
      return {
        hits: hits,
        misses: miss,
        count: await this.count(),
        size: await this.size(),
      };
    };

    //! PurgeStats
    this.purgeStats = async () => {
      hits = 0;
      miss = 0;

      let stats = await this.stats();
      this.emit("purge_stats", stats);
      return stats;
    };

    //? KEYS
    this.keys = async () => Object.keys($);

    //? VALUES
    this.values = async () => Object.values($);

    //? ENTRIES
    this.entries = async () => Object.entries($);
  }
};
