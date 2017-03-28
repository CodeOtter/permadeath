
var async = require('async')
var rimraf = require('rimraf')

module.exports = {
  'del': function (files, opts, callback) {
    if ((typeof opts) === 'function') {
      callback = opts
      opts = {}
    }
    callback = (typeof callback === 'function')
      ? callback
      : Function.prototype
    async.each(files || [], function (file, cb) {
      rimraf(file, opts || {}, cb)
    }, callback)
  }
}
