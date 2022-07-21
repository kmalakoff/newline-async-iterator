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
            var args = (0, _indexOfNewline).default(string, 0, true);
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
                if (next.value !== undefined) string += (0, _decodeUTF8Ts).default(next.value);
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
