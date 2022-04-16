const v_fs = require('v_file_system');

fixInputExpires = (expires) => {
  return (expires !== null && isNaN(expires)) ? expires : null;
};


module.exports = function V_Core_Cache(init = {}) {

  this.expires = fixInputExpires(init.expires) || null;



  this.cache = {};


  this.expired = expired = async (ttl) => {
    return (ttl > Date.now() || ttl == false);
  };


  this.getAll = list = async () => {
    return this.cache;
  };


  this.get = get = async (key = null) => {
    let data = this.cache[key];
    return (data != undefined) ? (await this.expired(data.expires) ? data.value : undefined) : undefined;
  };


  this.set = set = async (key, value, expires = this.expires) => {
    let data = {
      name: key,
      value: value,
      expires: (isNaN(expires) || expires == null) ? false : (Date.now() + expires)
    };
    this.cache[key] = data;
    return this.get(key);
  };


  this.has = has = async (key) => {
    let data = this.cache[key];
    return (data != undefined) ? await this.expired(data.expires) : false;
  };


  this.del = del = async (key) => {
    delete this.cache[key];
  };


  this.purge = purge = async () => {
    this.cache = {};
    return (this.cache == {});
  };


  this.size = size = async () => {
    return Object.keys(this.cache).length;
  };


  this.keys = keys = async () => {
    return Object.keys(this.cache);
  };


  this.values = values = async () => {
    return Object.values(this.cache);
  };


  this.entries = entries = async () => {
    return Object.entries(this.cache);
  };


  this.toJSON = toJSON = () => {
    return JSON.stringify(this.cache);
  };


  this.fromJSON = fromJSON = async (json) => {
    try {
      this.cache = JSON.parse(json);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };


  this.toString = toString = async () => {
    return this.toJSON();
  };


  this.fromString = fromString = async (string) => {
    return this.fromJSON(string);
  };


  this.toFile = toFile = (file) => {
    return v_fs.writeSy(file, this.toJSON());
  };


  this.fromFile = fromFile = (file) => {
    const data = v_fs.readSy(file);
    return (data !== false) ? this.fromJSON(data) : false;
  };


};
