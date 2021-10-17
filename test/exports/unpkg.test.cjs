/* eslint-disable @typescript-eslint/no-var-requires */
require("../lib/polyfill.cjs");
const { assert } = require("chai");
const newlineIterator = require("newline-async-iterator/dist/umd/newline-async-iterator.js");
const stringIterator = require("../lib/stringIterator.cjs");

describe("exports newline-async-iterator/dist/umd/newline-async-iterator.js", function () {
  it("first newline", function (done) {
    const iterator = newlineIterator(stringIterator("some\r\nstring\ncombination\r"));
    iterator
      .next()
      .then(function (next) {
        assert.deepEqual(next, { value: "some", done: false });
        done();
      })
      .catch(done);
  });
});
