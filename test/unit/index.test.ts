import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import Pinkie from 'pinkie-promise';
import chunkIterator, { encodeUTF8 } from '../lib/chunkIterator.ts';
import stringIterator from '../lib/stringIterator.ts';

const hasAsyncIterable = typeof Symbol !== 'undefined' && Symbol.asyncIterator !== undefined;

// Unicode test strings
const EMOJI_SIMPLE = '😀'; // 4-byte UTF-8: F0 9F 98 80
const EMOJI_FAMILY = '👨‍👩‍👧‍👦'; // Multi-codepoint emoji with ZWJ
const CJK = '中文'; // 3-byte UTF-8 each: E4 B8 AD E6 96 87
const COMBINING = 'café'; // 'e' + combining acute accent
const ANSI_RED = '\u001B[31m';
const ANSI_RESET = '\u001B[0m';

describe('newline-async-iterator', () => {
  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

  describe('next', () => {
    it('all values', (done) => {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(stringIterator(string));

      iterator
        .next()
        .then((next) => {
          assert.deepEqual(next, { value: 'some', done: false });
          iterator
            .next()
            .then((next) => {
              assert.deepEqual(next, { value: 'string', done: false });
              iterator
                .next()
                .then((next) => {
                  assert.deepEqual(next, { value: 'combination', done: false });
                  iterator
                    .next()
                    .then((next) => {
                      assert.deepEqual(next, { value: null, done: true });
                      done();
                    })
                    .catch(done);
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('no breaks', (done) => {
      const string = 'somestringcombination';
      const iterator = newlineIterator(stringIterator(string));
      iterator
        .next()
        .then((next) => {
          assert.deepEqual(next, {
            value: 'somestringcombination',
            done: false,
          });
          iterator
            .next()
            .then((next) => {
              assert.deepEqual(next, { value: null, done: true });
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe('iterator', () => {
    if (!hasAsyncIterable) return;

    it('all values', async () => {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(stringIterator(string));

      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['some', 'string', 'combination']);
    });

    it('no breaks', async () => {
      const string = 'somestringcombination';
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['somestringcombination']);
    });
  });

  describe('unicode', () => {
    if (!hasAsyncIterable) return;

    it('preserves simple emoji in lines', async () => {
      const string = `Hello${EMOJI_SIMPLE}\nWorld${EMOJI_SIMPLE}`;
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`Hello${EMOJI_SIMPLE}`, `World${EMOJI_SIMPLE}`]);
    });

    it('preserves family emoji in lines', async () => {
      const string = `${EMOJI_FAMILY}\ntext\n${EMOJI_FAMILY}`;
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [EMOJI_FAMILY, 'text', EMOJI_FAMILY]);
    });

    it('preserves CJK characters', async () => {
      const string = `Hello${CJK}\r\n${CJK}World\n${CJK}`;
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`Hello${CJK}`, `${CJK}World`, CJK]);
    });

    it('preserves ANSI escape sequences', async () => {
      const string = `${ANSI_RED}Red text${ANSI_RESET}\nNormal text`;
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`${ANSI_RED}Red text${ANSI_RESET}`, 'Normal text']);
    });

    it('handles mixed unicode and ANSI', async () => {
      const string = `${ANSI_RED}${EMOJI_SIMPLE}${CJK}${ANSI_RESET}\r\n${EMOJI_FAMILY}\n${COMBINING}`;
      const iterator = newlineIterator(stringIterator(string));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`${ANSI_RED}${EMOJI_SIMPLE}${CJK}${ANSI_RESET}`, EMOJI_FAMILY, COMBINING]);
    });
  });

  describe('chunk boundaries', () => {
    if (!hasAsyncIterable) return;

    it('handles 4-byte emoji split after byte 1', async () => {
      // 😀 is F0 9F 98 80 in UTF-8
      const string = `a${EMOJI_SIMPLE}b\n`;
      const bytes = encodeUTF8(string);
      // Split after 'a' (1 byte) + first byte of emoji = index 2
      const iterator = newlineIterator(chunkIterator(bytes, [2]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`a${EMOJI_SIMPLE}b`]);
    });

    it('handles 4-byte emoji split after byte 2', async () => {
      const string = `a${EMOJI_SIMPLE}b\n`;
      const bytes = encodeUTF8(string);
      // Split after 'a' (1 byte) + first 2 bytes of emoji = index 3
      const iterator = newlineIterator(chunkIterator(bytes, [3]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`a${EMOJI_SIMPLE}b`]);
    });

    it('handles 4-byte emoji split after byte 3', async () => {
      const string = `a${EMOJI_SIMPLE}b\n`;
      const bytes = encodeUTF8(string);
      // Split after 'a' (1 byte) + first 3 bytes of emoji = index 4
      const iterator = newlineIterator(chunkIterator(bytes, [4]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`a${EMOJI_SIMPLE}b`]);
    });

    it('handles 3-byte CJK character split after byte 1', async () => {
      // 中 is E4 B8 AD in UTF-8
      const string = 'a中b\n';
      const bytes = encodeUTF8(string);
      // Split after 'a' (1 byte) + first byte of 中 = index 2
      const iterator = newlineIterator(chunkIterator(bytes, [2]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['a中b']);
    });

    it('handles 3-byte CJK character split after byte 2', async () => {
      const string = 'a中b\n';
      const bytes = encodeUTF8(string);
      // Split after 'a' (1 byte) + first 2 bytes of 中 = index 3
      const iterator = newlineIterator(chunkIterator(bytes, [3]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, ['a中b']);
    });

    it('handles multiple split points within multi-byte sequence', async () => {
      // Split emoji at every byte boundary
      const string = `${EMOJI_SIMPLE}\n`;
      const bytes = encodeUTF8(string);
      // 😀 is 4 bytes, split at each: [1, 2, 3]
      const iterator = newlineIterator(chunkIterator(bytes, [1, 2, 3]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [EMOJI_SIMPLE]);
    });

    it('handles multiple emoji split across chunks', async () => {
      const string = `${EMOJI_SIMPLE}${EMOJI_SIMPLE}\n`;
      const bytes = encodeUTF8(string);
      // Split between the two emoji (after byte 4)
      const iterator = newlineIterator(chunkIterator(bytes, [4]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`${EMOJI_SIMPLE}${EMOJI_SIMPLE}`]);
    });

    it('handles emoji and newline in separate chunks', async () => {
      const string = `${EMOJI_SIMPLE}\ntext`;
      const bytes = encodeUTF8(string);
      // Split after emoji, before newline
      const iterator = newlineIterator(chunkIterator(bytes, [4]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [EMOJI_SIMPLE, 'text']);
    });

    it('handles complex multi-codepoint emoji split', async () => {
      // Family emoji has multiple code points with ZWJ
      const string = `a${EMOJI_FAMILY}b\n`;
      const bytes = encodeUTF8(string);
      // Split at various points
      const iterator = newlineIterator(chunkIterator(bytes, [5, 10, 15]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`a${EMOJI_FAMILY}b`]);
    });

    it('handles single-byte chunks for multi-byte character', async () => {
      // Each byte of the emoji comes in its own chunk
      const string = `${EMOJI_SIMPLE}\n`;
      const bytes = encodeUTF8(string);
      // Split after every byte: [1, 2, 3, 4]
      const iterator = newlineIterator(chunkIterator(bytes, [1, 2, 3, 4]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [EMOJI_SIMPLE]);
    });

    it('handles ANSI and emoji with chunk splits', async () => {
      const string = `${ANSI_RED}${EMOJI_SIMPLE}${ANSI_RESET}\ntext`;
      const bytes = encodeUTF8(string);
      // Split in middle of emoji (ANSI_RED is 5 bytes, then emoji starts)
      const iterator = newlineIterator(chunkIterator(bytes, [7]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`${ANSI_RED}${EMOJI_SIMPLE}${ANSI_RESET}`, 'text']);
    });

    it('handles combining character split from base', async () => {
      // café with combining accent: 'caf' + 'e' + combining acute (CC 81)
      const string = `${COMBINING}\n`;
      const bytes = encodeUTF8(string);
      // Split between 'e' and combining acute
      const eIndex = bytes.indexOf(0x65); // 'e' is 0x65
      const iterator = newlineIterator(chunkIterator(bytes, [eIndex + 1]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [COMBINING]);
    });

    it('handles multiple lines with unicode split across boundaries', async () => {
      const string = `${EMOJI_SIMPLE}line1\n${CJK}line2\n${EMOJI_FAMILY}`;
      const bytes = encodeUTF8(string);
      // Split in middle of first emoji and in middle of CJK
      const iterator = newlineIterator(chunkIterator(bytes, [2, 15]));
      const results = [];
      for await (const line of iterator) results.push(line);
      assert.deepEqual(results, [`${EMOJI_SIMPLE}line1`, `${CJK}line2`, EMOJI_FAMILY]);
    });
  });
});
