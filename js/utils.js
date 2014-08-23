var Immutable = require('immutable')

var assign = function(src, tgt) {
  return Immutable.Map(src).merge(tgt).toJS();
}

var assoc = function(src, k, v) {
  var dumb = {}
  dumb[k] = v
  return assign(src, dumb)
}

var identity = function(t) {
  return function(x) { return t }
}

module.exports = {assign: assign, assoc: assoc, identity: identity}