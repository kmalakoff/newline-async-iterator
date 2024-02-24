"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
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
 */ "default", {
    enumerable: true,
    get: function() {
        return newlineIterator;
    }
});
var _indexofnewline = /*#__PURE__*/ _interop_require_default(require("index-of-newline"));
var _decodeUTF8ts = /*#__PURE__*/ _interop_require_default(require("./decodeUTF8.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
function newlineIterator(source) {
    var string = "";
    var done = false;
    /* c8 ignore start */ var sourceIterator = hasIterator ? source[Symbol.asyncIterator]() : source;
    /* c8 ignore stop */ function generateNext() {
        return new Promise(function(resolve, reject) {
            var args = (0, _indexofnewline.default)(string, 0, true);
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
                if (next.value !== undefined) string += (0, _decodeUTF8ts.default)(next.value);
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }