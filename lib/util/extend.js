var sortedObjectKeys = require('./sorted-object-keys')
module.exports = function (base, opts) {
  var keys = sortedObjectKeys(opts)
  for (var i = 0; i < keys.length; ++i) {
    base[keys[i]] = opts[keys[i]]
  }
  return base
}
