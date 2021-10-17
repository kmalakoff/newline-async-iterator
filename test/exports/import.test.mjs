import "../lib/polyfill.cjs";
import { assert } from "chai";
import newlineIterator from "newline-async-iterator";
import stringIterator from "../lib/stringIterator.cjs";

describe("exports .mjs", function () {
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
