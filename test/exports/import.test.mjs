import { assert } from "chai";
import newlineIterator from "newline-async-iterator";
import stringIterator from "../lib/stringIterator.cjs";

describe("exports .mjs", function () {
  it("first newline", async function () {
    const iterator = newlineIterator(stringIterator("some\r\nstring\ncombination\r"));
    assert.deepEqual(await iterator.next(), { value: "some", done: false });
  });
});
