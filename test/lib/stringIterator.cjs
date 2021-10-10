module.exports = function stringIterator(string) {
  let offset = 0;
  return {
    next() {
      if (offset >= string.length) return Promise.resolve({ value: undefined, done: true });
      const s = string.substring(offset, ++offset);
      return Promise.resolve({ value: Uint8Array.from(s, (x) => x.charCodeAt(0)), done: false });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
};
