console.log("YEA");

const V_Core_Cache = require('../..');
const cache = new V_Core_Cache();

// Example Events
cache.on('hit', (data) => log("hit: ", data));

cache.on('miss', (data) => log("miss: ", data));

cache.on('get', (data) => log("get: ", data));

cache.on('set', (data) => log("set: ", data));

cache.on('purge', (data) => log("purge: ", data));


// Debug and Logging
let debug = true;

const log = async (...args) => {
  if (debug) {
    console.log(...args);
  }
};



const actions = {
  changeAppVersion: async () => await cache.set('application_version', document.querySelector('#customVersion').value),
  changeAppTitle: async () => await cache.set('application_title', document.querySelector('#customTitle').value)
};

// Example Application
const appHeader = async () => {
  return `<div class='appHeader'>
            <h1>${await cache.get('application_title')}</h1>
            <h2>Version: ${await cache.get('application_version')}</h2>
          </div>`;
};


const changeTitleForm = async () => {
  return `<div class='appHeader'>
            <h3>Change Application Title:</h3>
            <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await cache.get('application_title')}' />
            <button action='changeAppTitle'>Change</button>
          </div>`;
};


const changeVersionForm = async () => {
  return `<div class='appHeader'>
            <h3>Change Application Version:</h3>
            <input type='text' id='customVersion' placeholder='Change Title to Something' value='${await cache.get('application_version')}' />
            <button action='changeAppVersion'>Change</button>
          </div>`;
};


const app = async () => {
  let startTime = Date.now();
  document.querySelector('v_app').innerHTML = `${await appHeader()}${await changeTitleForm()}${await changeVersionForm()}`;
  let endTime = Date.now() - startTime;
  log(`App Rendered in ${endTime}ms`);
};

cache.on('set', async () => await app());


// Run the whole thing
(async () => {

  window.onclick = async (event) => {
    let action = event.target.getAttribute('action');
    if (actions[action] !== undefined) {
      await actions[action]();
    }
  };

  log(await cache.stats());

  log(await cache.set('test', 11));

  log(await cache.get('test'));

  log(await cache.get('missing_key_item'));

  await cache.set('application_title', 'V_Core_Cache Example');
  await cache.set('application_version', '1.0.0');

})();
