


(async () => {

  const V_Core_Cache = require('.');
  const cache = new V_Core_Cache();

  cache.on("get", (data) => console.log("GET Event: " + JSON.stringify(data)));

  cache.on("set", (data) => console.log("SET Event: " + JSON.stringify(data)));

  // Stats Print => all stats = 0
  console.log(await cache.stats());

  // print all cache => Empty Object
  console.log(await cache.getAll());

  // Check if cache has item => false
  console.log(await cache.has("foo"));

  // Get item from cache => undefined
  console.log(await cache.get("foo"));

  // Set item to cache => true
  console.log(await cache.set("foo", "yea"));

  // Check if cache has item => true
  console.log(await cache.has("foo"));

  // Get item from cache => "yea"
  console.log(await cache.get("foo"));


  // Stats Print => all stats = 1
  console.log(await cache.stats());


  // Print names of items in cache => [ 'foo' ]
  console.log(await cache.keys());

  // Print values
  console.log(await cache.values());




  console.log(await cache.set("foo2", { name: "yea", age: "2" }, 100));


  console.log(await cache.del("foo"));
  console.log(await cache.del("foo"));

  console.log(await cache.values());




  setTimeout(async () => {

    console.log(await cache.get("foo2"));
    console.log(await cache.values());

  }, 150);



})();
