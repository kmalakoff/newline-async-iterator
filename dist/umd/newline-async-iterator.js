(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('index-of-newline')) :
  typeof define === 'function' && define.amd ? define(['index-of-newline'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.newlineAsyncIterator = factory(global.indexOfNewline));
})(this, (function (indexOfNewline) { 'use strict';

  // https://developer.mozilla.org/en-US/docs/Glossary/Base64#Solution_2_%E2%80%93_JavaScript's_UTF-16_%3E_UTF-8_%3E_base64
  /* c8 ignore start */ var decodeUTF8 = function decode(uint8Array) {
      var sView = "";
      for(var nPart, nLen = uint8Array.length, nIdx = 0; nIdx < nLen; nIdx++){
          nPart = uint8Array[nIdx];
          sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */  ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */ (nPart - 252) * 1073741824 + (uint8Array[++nIdx] - 128 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */  ? (nPart - 248 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */  ? (nPart - 240 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */  ? (nPart - 224 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */  ? (nPart - 192 << 6) + uint8Array[++nIdx] - 128 : /* nPart < 127 ? */ /* one byte */ nPart);
      }
      return sView;
  };
  /* c8 ignore stop */ if (typeof TextDecoder !== "undefined") {
      var decoder = new TextDecoder("utf8");
      decodeUTF8 = function decodeTextDecoder(uint8Array) {
          return decoder.decode(uint8Array);
      };
  }
  var decodeUTF8$1 = decodeUTF8;

  var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
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
   */ function newlineIterator(source) {
      var string = "";
      var done = false;
      /* c8 ignore start */ var sourceIterator = hasIterator ? source[Symbol.asyncIterator]() : source;
      /* c8 ignore stop */ function generateNext() {
          return new Promise(function(resolve, reject) {
              var args = indexOfNewline(string, 0, true);
              var index = args[0];
              var skip = args[1];
              if (index >= 0) {
                  if (index !== string.length - 1 || string[index] === "\n") return resolve([
                      index,
                      skip
                  ]);
              }
              if (done) return resolve([
                  index,
                  skip
              ]);
              sourceIterator.next().then(function(next) {
                  if (next.done) done = true;
                  if (next.value !== undefined) string += decodeUTF8$1(next.value);
                  generateNext().then(resolve).catch(reject);
              });
          });
      }
      var iterator = {
          next: function next() {
              return new Promise(function(resolve, reject) {
                  generateNext().then(function(args) {
                      var index = args[0];
                      var skip = args[1];
                      if (index < 0) {
                          if (!string.length) return resolve({
                              value: undefined,
                              done: true
                          });
                          var result = {
                              value: string,
                              done: false
                          };
                          string = "";
                          return resolve(result);
                      }
                      var line = string.substr(0, index);
                      string = string.substr(index + skip);
                      return resolve({
                          value: line,
                          done: false
                      });
                  }).catch(reject);
              });
          }
      };
      if (hasIterator) {
          iterator[Symbol.asyncIterator] = function() {
              return this;
          };
      }
      return iterator;
  }

  return newlineIterator;

}));
//# sourceMappingURL=newline-async-iterator.js.map
