const V_Core_Cache = require('../..');
const cache = new V_Core_Cache();

// Debug and Logging
let debug = false;

const log = async (...args) => {
  if (debug) {
    console.log(...args);
  }
};



// Example Application
const actions = {
  changeAppVersion: async () => await cache.set('application_version', document.querySelector('#customVersion').value),
  changeAppTitle: async () => await cache.set('application_title', document.querySelector('#customTitle').value),
  logStats: async () => log(await cache.stats()),
  purgeCache: async () => await cache.purge(),
  purgeCacheStats: async () => await cache.purgeStats(),
  logAllCache: async () => log(await cache.getAll()),
  logUndefinedItem: async () => log(await cache.get('logUndefinedItem')),
};

const app_info = async () => {
  return `<div>
            <h1>${await cache.get('application_title')}</h1>
            <h2>Version: ${await cache.get('application_version')}</h2>
          </div>`;
};

const change_title_form = async () => {
  return `<div>
            <h3>Change Application Title:</h3>
            <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await cache.get('application_title')}' />
            <button action='changeAppTitle'>Change</button>
          </div>`;
};

const change_version_form = async () => {
  return `<div>
            <h3>Change Application Version:</h3>
            <input type='text' id='customVersion' placeholder='Change Title to Something' value='${await cache.get('application_version')}' />
            <button action='changeAppVersion'>Change</button>
          </div>`;
};

const cache_actions = async () => {
  return `<div>
            <h3>Cache Actions:</h3>
            <button action='logUndefinedItem'>Log undefined Item</button>
            <button action='logAllCache'>Log All Cache</button>
            <button action='logStats'>Log Cache Stats</button>
            <button action='purgeCacheStats'>Purge Stats</button>
            <button action='purgeCache'>Purge Cache</button>
          </div>`;
};

const renderApp = async () => {
  return `${await change_title_form()}
          ${await change_version_form()}
          ${await cache_actions()}
          ${await app_info()}`;
}

const app = async (data) => {
  let startTime = Date.now();
  let happened = 'App Render Cache Update';
  if (data.name === 'appRender') {
    happened = 'App DOM Update';
    document.querySelector('v_app').innerHTML = await cache.get("appRender");
  } else {
    await cache.set("appRender", await renderApp(), 16);
  }
  let endTime = Date.now() - startTime;
  log(`${happened} in ${endTime}ms`);
};



// Run the whole thing
(async () => {

  cache.on('set', app);

  cache.on('purge', async () => {
    log('Cache Purged');
    await app({});
  });

  cache.on('purge_stats', async (data) => {
    log('purge_stats CB>>', data);
  });

  window.onclick = async (event) => {
    let action = event.target.getAttribute('action');
    if (actions[action] !== undefined) {
      await actions[action]();
    }
  };

  await cache.set('application_title', 'V_Core_Cache Example');
  await cache.set('application_version', '1.0.0');

  for (let i = 0; i < 1000; i++) {
    await cache.set('item_' + i, 'Item ' + i);
  }

  debug = true;
})();
