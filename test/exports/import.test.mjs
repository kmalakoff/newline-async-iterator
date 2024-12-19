import assert from 'assert';
import newlineIterator from 'newline-async-iterator';
import stringIterator from '../lib/stringIterator.ts';

describe('exports .mjs', () => {
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
