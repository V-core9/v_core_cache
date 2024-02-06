const logger = (...arg) => (process.env.NODE_ENV === 'test' ? console.log(arg) : null)

module.exports = logger
