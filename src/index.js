const v_fs = require('v_file_system');
const path = require("path");

function V_Cache() {

  this.cache = {};

  this.getAll = list = async () => {
    return this.cache;
  };


  this.get = get = async (key = null) => {
    let data = this.cache[key];
    return (data != undefined) ? ((data.expires > Date.now() || data.expires == false) ? data.value : null) : null;
  };


  this.set = async (key, value, expires = null) => {
    let data = {
      name: key,
      value: value,
      expires: (isNaN(expires) || expires == null) ? false : (Date.now() + expires)
    };
    this.cache[key] = data;
    return this.get(key);
  };


  this.remove = async (key) => {
    delete this.cache[key];
  };


  this.clear = async () => {
    this.cache = {};
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
    this.cache = JSON.parse(json);
  };


  this.toString = async () => {
    return this.toJSON();
  };


  this.fromString = async (string) => {
    this.fromJSON(string);
  };


  this.toFile = (file) => {
    return v_fs.writeSy(path.join(__dirname, file), this.toJSON());
  };


  this.fromFile = (file) => {
    const data = v_fs.readSy(path.join(__dirname, file));
    return (data !== false) ? this.fromJSON(data) : false;
  };

}


module.exports = V_Cache;
