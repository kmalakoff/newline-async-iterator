// @ts-ignore
import encodeUTF8 from './encodeUTF8.ts';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

export default function stringIterator(string) {
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
}
