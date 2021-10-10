import indexOfNewline from "index-of-newline";
import decodeUTF8 from "./decodeUTF8";

/**
 * Create a newlinw iterator recognizing CR, LF, and CRLF using the Symbol.iterator interface
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

export default function newlineIterator(iterable: AsyncIterable<Uint8Array>): AsyncIterableIterator<string> {
  let string = "";
  let done = false;
  const iterator = iterable[Symbol.asyncIterator]();
  function generateNext(): Promise<number[]> {
    return new Promise(function (resolve, reject) {
      const [index, skip] = indexOfNewline(string, 0, true) as number[];
      if (index >= 0) {
        if (index !== string.length - 1 || string[index] === "\n") return resolve([index, skip]);
      }
      if (done) return resolve([index, skip]);
      iterator.next().then(function (next) {
        if (next.done) done = true;
        if (next.value !== undefined) string += decodeUTF8(next.value);
        generateNext().then(resolve).catch(reject);
      });
    });
  }

  return {
    next(): Promise<IteratorResult<string, boolean>> {
      return new Promise(function (resolve, reject) {
        generateNext()
          .then(function ([index, skip]) {
            if (index < 0) {
              if (!string.length) return resolve({ value: undefined, done: true });
              const result: IteratorResult<string, boolean> = { value: string, done: false };
              string = "";
              return resolve(result);
            }
            const line = string.substr(0, index);
            string = string.substr(index + skip);
            return resolve({ value: line, done: false });
          })
          .catch(reject);
      });
    },
    [Symbol.asyncIterator](): AsyncIterator<string> {
      return this;
    },
  } as AsyncIterableIterator<string>;
}
