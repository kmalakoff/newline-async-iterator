/* eslint-disable @typescript-eslint/no-var-requires */
const encodeUTF8 = require('./encodeUTF8.cjs');

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function stringIterator(string) {
  let offset = 0;
  const iterator = {
    next() {
      if (offset >= string.length) return Promise.resolve({ value: undefined, done: true });
      const s = string.substring(offset, ++offset);
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
