const V_Core_Cache = require("..");
const vcc = new V_Core_Cache();
const vccBenchStats = {
  sItemPerMS: 0, // items per ms SET,
  gItemPerMS: 0, // items per ms GET,
};

const NodeCache = require("node-cache");
const nc = new NodeCache();
const ncBenchStats = {
  sItemPerMS: 0, // items per ms SET,
  gItemPerMS: 0, // items per ms GET,
};

const itemsCount = 5000000;

const testVCC = async () => {
  // WRITE/SET Speed Test
  let startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    await vcc.set(`_${i}`, i);
  }
  let endTS = Date.now();
  vccBenchStats.sItemPerMS = itemsCount / (endTS - startTS);
  console.log("VCC SET : " + vccBenchStats.sItemPerMS);

  // READ/GET Speed Test
  startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    await vcc.get(`_${i}`);
  }
  endTS = Date.now();
  vccBenchStats.gItemPerMS = itemsCount / (endTS - startTS);
  console.log("VCC GET : " + vccBenchStats.gItemPerMS);

  // Purge to 0
  await vcc.purge();
};

const testNC = async () => {
  // WRITE/SET Speed Test
  let startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    nc.set(`_${i}`, i);
  }
  let endTS = Date.now();
  ncBenchStats.sItemPerMS = itemsCount / (endTS - startTS);
  console.log("NC SET : " + ncBenchStats.sItemPerMS);

  // READ/GET Speed Test
  startTS = Date.now();
  for (let i = 0; i < itemsCount; i++) {
    nc.get(`_${i}`);
  }
  endTS = Date.now();
  ncBenchStats.gItemPerMS = itemsCount / (endTS - startTS);
  console.log("NC GET : " + ncBenchStats.gItemPerMS);

  // Purge to 0
  nc.flushAll();
};

(async () => {
  await testVCC();
  await testNC();

  console.log('VCC / NC [set] => ' + Math.trunc(((vccBenchStats.sItemPerMS / ncBenchStats.sItemPerMS) - 1) * 100) + '%');
  console.log('VCC / NC [get] => ' + Math.trunc(((vccBenchStats.gItemPerMS / ncBenchStats.gItemPerMS) - 1) * 100) + '%');
})();
