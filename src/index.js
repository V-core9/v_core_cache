const v_fs = require('v_file_system');

function V_Core_Cache(init = {}) {

  this.expires = init.expires || null;

  this.cache = {};

  this.getAll = list = async () => {
    return this.cache;
  };


  this.get = get = async (key = null) => {
    let data = this.cache[key];
    return (data != undefined) ? ((data.expires > Date.now() || data.expires == false) ? data.value : null) : null;
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


  this.del = del = async (key) => {
    delete this.cache[key];
  };


  this.purge = purge = async () => {
    this.cache = {};
    return (this.cache == {}) ? true : false;
  };


  this.size = async () => {
    return Object.keys(this.cache).length;
  };


  this.keys = async () => {
    return Object.keys(this.cache);
  };


  this.values = async () => {
    return Object.values(this.cache);
  };


  this.entries = async () => {
    return Object.entries(this.cache);
  };


  this.toJSON = () => {
    return JSON.stringify(this.cache);
  };

  this.fromJSON = async (json) => {
    try {
      this.cache = JSON.parse(json);
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


  this.toFile = (file) => {
    return v_fs.writeSy(file, this.toJSON());
  };


  this.fromFile = (file) => {
    const data = v_fs.readSy(file);
    return (data !== false) ? this.fromJSON(data) : false;
  };

}


module.exports = V_Cache;
