const hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
const hasBuffer = typeof Buffer !== "undefined";

if (hasBuffer && !Buffer.alloc) {
  Buffer.alloc = function alloc(length, data) {
    let buffer = data;
    while (--length > 0) buffer += data;
    return new Buffer(buffer);
  };
}

function from(s) {
  return hasBuffer ? Buffer.alloc(1, s) : Uint8Array.from(s, (x) => x.charCodeAt(0));
}

module.exports = function stringIterator(string) {
  let offset = 0;
  const iterator = {
    next() {
      if (offset >= string.length) return Promise.resolve({ value: undefined, done: true });
      const s = string.substring(offset, ++offset);
      return Promise.resolve({ value: from(s), done: false });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  return iterator;
};
