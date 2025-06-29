import decodeUTF8 from './decodeUTF8.ts';

const REGEX_NEW_LINE = /\r?\n|\r/g;

const root = typeof window === 'undefined' ? global : window;
// biome-ignore lint/suspicious/noShadowRestrictedNames: Legacy
const Symbol: SymbolConstructor = typeof root.Symbol === 'undefined' ? ({ asyncIterator: undefined } as unknown as SymbolConstructor) : root.Symbol;

/**
 * Create a newline iterator recognizing CR, LF, and CRLF using the Symbol.asyncIterator interface
 *
 * @param source The string to iterate through
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
  const lines = [];
  let last = '';
  let done = false;

  const sourceIterator = Symbol.asyncIterator ? source[Symbol.asyncIterator]() : source;

  function generateNext(): Promise<IteratorResult<string, boolean>> {
    return new Promise((resolve, reject) => {
      sourceIterator.next().then((next) => {
        if (next.done) done = true;
        else last += decodeUTF8(next.value);

        const end = last.length > 0 ? last[last.length - 1] : '';
        if (done || (end !== '\r' && end !== '\n')) {
          const moreLines = last.split(REGEX_NEW_LINE);
          last = moreLines.pop();
          moreLines.forEach((line) => lines.unshift(line));
          if (done && last.length > 0) {
            lines.unshift(last);
            last = '';
          }
        }

        if (lines.length > 0) {
          const value = lines.pop();
          if (done && lines.length === 0 && value.length === 0) return resolve({ value: null, done: true });
          return resolve({ value, done: false });
        }
        if (done) return resolve({ value: null, done: true });
        generateNext().then(resolve).catch(reject); // get more
      });
    });
  }

  const iterator = {
    next(): Promise<IteratorResult<string, boolean>> {
      return generateNext();
    },
    [Symbol.asyncIterator](): AsyncIterator<string> {
      return this;
    },
  };

  return iterator as AsyncIterableIterator<string>;
}
