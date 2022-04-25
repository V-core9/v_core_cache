console.log("YEA");

const V_Core_Cache = require('../..');
const cache = new V_Core_Cache();

let debug = true;

const log = async (...args) => {
  if (debug) {
    console.log(...args);
  }
};

(async () => {

  log(await cache.stats());

  log(await cache.set('test', 11));

  log(await cache.get('test'));
})();
