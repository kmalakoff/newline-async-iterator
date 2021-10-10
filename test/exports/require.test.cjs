/* eslint-disable @typescript-eslint/no-var-requires */
const { assert } = require("chai");
const newlineIterator = require("newline-async-iterator");
const stringIterator = require("../lib/stringIterator.cjs");

describe("exports .cjs", function () {
  it("first newline", async function () {
    const iterator = newlineIterator(stringIterator("some\r\nstring\ncombination\r"));
    assert.deepEqual(await iterator.next(), { value: "some", done: false });
  });
});
