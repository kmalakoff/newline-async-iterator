require('../lib/polyfill.cjs');
const assert = require('assert');
const newlineIterator = require('newline-async-iterator');
const stringIterator = require('../lib/stringIterator.cjs');

describe('exports .cjs', () => {
  it('first newline', (done) => {
    const iterator = newlineIterator(stringIterator('some\r\nstring\ncombination\r'));
    iterator
      .next()
      .then((next) => {
        assert.deepEqual(next, { value: 'some', done: false });
        done();
      })
      .catch(done);
  });
});
