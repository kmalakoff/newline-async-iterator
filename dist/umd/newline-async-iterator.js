(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.newlineAsyncIterator = factory());
})(this, (function () { 'use strict';

    /**
     * Find indexOf CR, LF, or CRLF
     *
     * @param string The search string
     * @param offset The offset for searching
     * @param includeLength Include the length in the return value
     * @returns When includeLength is true, returns a pair of [offset, length] to provide the length of CR (1), LF (1) or CRLF (2)
     */ function indexOfNewline(string) {
        var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, includeLength = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        if (offset < 0) throw new Error("Unexpected negative offset");
        if (offset > string.length) throw new Error("Offset is longer than the string. Offset: ".concat(offset, ". String: ").concat(string.length));
        while(offset < string.length){
            var value = string[offset];
            if (value === "\n") return includeLength ? [
                offset,
                1
            ] : offset;
            else if (value === "\r") {
                return includeLength ? [
                    offset,
                    string[offset + 1] === "\n" ? 2 : 1
                ] : offset;
            }
            offset++;
        }
        return includeLength ? [
            -1,
            0
        ] : -1;
    }

    /* eslint-disable no-undef */ // https://developer.mozilla.org/en-US/docs/Glossary/Base64#Solution_2_%E2%80%93_JavaScript's_UTF-16_%3E_UTF-8_%3E_base64
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

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally{
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
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
     */ function newlineIterator(source) {
        var string = "";
        var done = false;
        /* c8 ignore start */ var sourceIterator = hasIterator ? source[Symbol.asyncIterator]() : source;
        /* c8 ignore stop */ function generateNext() {
            return new Promise(function(resolve, reject) {
                var ref = _slicedToArray(indexOfNewline(string, 0, true), 2), index = ref[0], skip = ref[1];
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
                    generateNext().then(function(param) {
                        var _param = _slicedToArray(param, 2), index = _param[0], skip = _param[1];
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
