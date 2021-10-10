/* eslint-disable @typescript-eslint/no-var-requires */
const { assert } = require("chai");
const newlineIterator = require("newline-async-iterator/dist/umd/newline-async-iterator.js");
const stringIterator = require("../lib/stringIterator.cjs");

describe("exports newline-async-iterator/dist/umd/newline-async-iterator.js", function () {
  it("first newline", async function () {
    const iterator = newlineIterator(stringIterator("some\r\nstring\ncombination\r"));
    assert.deepEqual(await iterator.next(), { value: "some", done: false });
  });
});
