"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = newlineIterator;
var _indexOfNewline = _interopRequireDefault(require("index-of-newline"));
var _decodeUTF8Ts = _interopRequireDefault(require("./decodeUTF8.js"));
function newlineIterator(source) {
    var string = "";
    var done = false;
    /* c8 ignore start */ var sourceIterator = hasIterator ? source[Symbol.asyncIterator]() : source;
    /* c8 ignore stop */ function generateNext() {
        return new Promise(function(resolve, reject) {
            var ref = _slicedToArray((0, _indexOfNewline).default(string, 0, true), 2), index = ref[0], skip = ref[1];
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
                if (next.value !== undefined) string += (0, _decodeUTF8Ts).default(next.value);
                generateNext().then(resolve)["catch"](reject);
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
                })["catch"](reject);
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
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
