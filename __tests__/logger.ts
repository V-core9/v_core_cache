const logger = (...arg) =>
  process.env.NODE_ENV === "development" ? console.log(arg) : null;

module.exports = logger;
