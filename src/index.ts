import indexOfNewline from 'index-of-newline';
// @ts-ignore
import decodeUTF8 from './decodeUTF8.ts';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/**
 * Create a newline iterator recognizing CR, LF, and CRLF using the Symbol.asyncIterator interface
 *
 * @param string The string to iterate through
 *
 * ```typescript
 * import newlineIterator from "newline-async-iterator";
 *
 * const iterator = newlineIterator("some\r\nstring\ncombination\r");
 * const results = [];
 * for (const line of iterator) results.push(line);
 * console.log(results); // ["some", "string", "combination"];
 * ```
 */

export default function newlineIterator(source: AsyncIterable<Uint8Array> | AsyncIterator<Uint8Array>): AsyncIterableIterator<string> {
  let string = '';
  let done = false;

  /* c8 ignore start */
  const sourceIterator = hasIterator ? source[Symbol.asyncIterator]() : source;
  /* c8 ignore stop */

  function generateNext(): Promise<number[]> {
    return new Promise(function (resolve, reject) {
      const args = indexOfNewline(string, 0, true) as number[];
      const index = args[0];
      const skip = args[1];
      if (index >= 0) {
        if (index !== string.length - 1 || string[index] === '\n') return resolve([index, skip]);
      }
      if (done) return resolve([index, skip]);
      sourceIterator.next().then(function (next) {
        if (next.done) done = true;
        if (next.value !== undefined) string += decodeUTF8(next.value);
        generateNext().then(resolve).catch(reject);
      });
    });
  }

  const iterator = {
    next(): Promise<IteratorResult<string, boolean>> {
      return new Promise(function (resolve, reject) {
        generateNext()
          .then(function (args) {
            const index = args[0];
            const skip = args[1];
            if (index < 0) {
              if (!string.length) return resolve({ value: undefined, done: true });
              const result: IteratorResult<string, boolean> = { value: string, done: false };
              string = '';
              return resolve(result);
            }
            const line = string.substr(0, index);
            string = string.substr(index + skip);
            return resolve({ value: line, done: false });
          })
          .catch(reject);
      });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function (): AsyncIterator<string> {
      return this;
    };
  }

  return iterator as AsyncIterableIterator<string>;
}
