import { assert } from "chai";
import newlineIterator from "newline-async-iterator";
import stringIterator from "../lib/stringIterator.cjs";
import "isomorphic-fetch";
import responseIterator from "response-iterator";

describe("newline-async-iterator", function () {
  describe("next", function () {
    it("all values", async function () {
      const string = "some\r\nstring\ncombination\r";
      const iterator = newlineIterator(stringIterator(string));

      assert.deepEqual(await iterator.next(), { value: "some", done: false });
      assert.deepEqual(await iterator.next(), { value: "string", done: false });
      assert.deepEqual(await iterator.next(), { value: "combination", done: false });
      assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    });

    it("no breaks", async function () {
      const string = "somestringcombination";
      const iterator = newlineIterator(stringIterator(string));
      assert.deepEqual(await iterator.next(), { value: "somestringcombination", done: false });
      assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    });
  });

  describe("iterator", function () {
    it("all values", async function () {
      const string = "some\r\nstring\ncombination\r";
      const iterator = newlineIterator(stringIterator(string));

      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ["some", "string", "combination"]);
    });

    it("no breaks", async function () {
      const string = "somestringcombination";
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ["somestringcombination"]);
    });
  });

  describe("fetch", function () {
    it("isomorphic-fetch", async function () {
      const res = await fetch("https://raw.githubusercontent.com/kmalakoff/newline-async-iterator/master/package.json");

      const lines = [];
      for await (const line of newlineIterator(responseIterator<Uint8Array>(res))) lines.push(line);
      assert.deepEqual(JSON.parse(lines.join("\r\n")).name, "newline-async-iterator");
    });
  });
});
