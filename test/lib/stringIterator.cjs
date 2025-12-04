var encodeUTF8 = require('./encodeUTF8.cjs');

var hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function stringIterator(string) {
  var offset = 0;
  var iterator = {
    next: function () {
      if (offset >= string.length) return Promise.resolve({ value: undefined, done: true });
      var s = string.substring(offset, ++offset);
      return Promise.resolve({ value: encodeUTF8(s), done: false });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  return iterator;
};
