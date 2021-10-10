import indexOfNewline from 'index-of-newline';

/* eslint-disable no-undef */
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#Solution_2_%E2%80%93_JavaScript's_UTF-16_%3E_UTF-8_%3E_base64

/* c8 ignore start */
let decodeUTF8 = function decode(uint8Array) {
  let sView = "";

  for (let nPart, nLen = uint8Array.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = uint8Array[nIdx];
    sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen
    /* six bytes */
    ?
    /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
    (nPart - 252) * 1073741824 + (uint8Array[++nIdx] - 128 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen
    /* five bytes */
    ? (nPart - 248 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen
    /* four bytes */
    ? (nPart - 240 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen
    /* three bytes */
    ? (nPart - 224 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen
    /* two bytes */
    ? (nPart - 192 << 6) + uint8Array[++nIdx] - 128 :
    /* nPart < 127 ? */

    /* one byte */
    nPart);
  }

  return sView;
};
/* c8 ignore stop */


if (typeof TextDecoder !== "undefined") {
  const decoder = new TextDecoder("utf8");

  decodeUTF8 = function decodeTextDecoder(uint8Array) {
    return decoder.decode(uint8Array);
  };
}

var decodeUTF8$1 = decodeUTF8;

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

function newlineIterator(iterable) {
  let string = "";
  let done = false;
  const iterator = iterable[Symbol.asyncIterator]();

  function generateNext() {
    return new Promise(function (resolve, reject) {
      const [index, skip] = indexOfNewline(string, 0, true);

      if (index >= 0) {
        if (index !== string.length - 1 || string[index] === "\n") return resolve([index, skip]);
      }

      if (done) return resolve([index, skip]);
      iterator.next().then(function (next) {
        if (next.done) done = true;
        if (next.value !== undefined) string += decodeUTF8$1(next.value);
        generateNext().then(resolve).catch(reject);
      });
    });
  }

  return {
    next() {
      return new Promise(function (resolve, reject) {
        generateNext().then(function ([index, skip]) {
          if (index < 0) {
            if (!string.length) return resolve({
              value: undefined,
              done: true
            });
            const result = {
              value: string,
              done: false
            };
            string = "";
            return resolve(result);
          }

          const line = string.substr(0, index);
          string = string.substr(index + skip);
          return resolve({
            value: line,
            done: false
          });
        }).catch(reject);
      });
    },

    [Symbol.asyncIterator]() {
      return this;
    }

  };
}

export { newlineIterator as default };
//# sourceMappingURL=index.js.map
