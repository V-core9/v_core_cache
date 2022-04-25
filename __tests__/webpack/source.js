const V_Core_Cache = require('../..');
const cache = new V_Core_Cache();

// Debug and Logging
let debug = true;

const log = async (...args) => {
  if (debug) {
    console.log(...args);
  }
};

// Example Application
const actions = {
  changeAppVersion: async () => await cache.set('application_version', document.querySelector('#customVersion').value),
  changeAppTitle: async () => await cache.set('application_title', document.querySelector('#customTitle').value)
};

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


const app = async (data) => {
  let startTime = Date.now();
  let happened = 'App Render Cache Update';
  if (data.name === 'appRender') {
    happened = 'App DOM Update';
    document.querySelector('v_app').innerHTML = await cache.get("appRender");
  } else {
    await cache.set("appRender", `${await appHeader()}${await changeTitleForm()}${await changeVersionForm()}`, 16);
  }
  let endTime = Date.now() - startTime;
  log(`${happened} in ${endTime}ms`);
};



// Run the whole thing
(async () => {

  cache.on('set', app);

  window.onclick = async (event) => {
    let action = event.target.getAttribute('action');
    if (actions[action] !== undefined) {
      await actions[action]();
    }
  };

  await cache.set('application_title', 'V_Core_Cache Example');
  await cache.set('application_version', '1.0.0');

})();
